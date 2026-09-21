import { randomUUID } from "node:crypto";

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CampoDependencia, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { PaginacaoDto } from "../common/paginacao.dto";
import { slugify } from "../common/slug";
import { getPaginationParams, buildPaginationMeta } from "../common/paginacao";

import { CriarFormularioDto } from "./dto/criar-formulario.dto";
import { CriarVersaoDto } from "./dto/criar-versao.dto";
import {
  CriarCampoDto,
  CriarDependenciaDto,
  CriarEtapaDto,
  CriarOpcaoDto,
  CriarRegraDto,
  CriarSecaoDto,
} from "./dto/campoDto";

@Injectable()
export class formularioService {
  constructor(private p: PrismaService) {}

  async listar(inst: string, paginacao?: PaginacaoDto) {
    const { page = 1, limit = 10 } = paginacao ?? {};
    const { skip, take } = getPaginationParams({ page, limit });

    const where = {
      instituicaoId: inst,
      eliminadoEm: null,
    };

    const [data, total] = await this.p.$transaction([
      this.p.formulario.findMany({
        where,
        include: {
          versoes: {
            orderBy: {
              numero: "desc",
            },
            take: 1,
          },
          links: {
            where: {
              status: "ATIVO",
            },
          },
        },
        orderBy: {
          criadoEm: "desc",
        },
        skip,
        take,
      }),
      this.p.formulario.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async detalhe(inst: string, id: string) {
    await this.formulario(id, inst);

    return this.p.formulario.findUnique({
      where: {
        id,
      },
      include: {
        versoes: {
          orderBy: {
            numero: "asc",
          },
          include: {
            etapas: {
              orderBy: {
                ordem: "asc",
              },
              include: {
                secoes: {
                  orderBy: {
                    ordem: "asc",
                  },
                  include: {
                    campos: {
                      orderBy: {
                        ordem: "asc",
                      },
                      include: {
                        opcoes: {
                          orderBy: {
                            ordem: "asc",
                          },
                        },
                        regras: true,
                        dependencias: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        publicacoes: {
          include: {
            links: true,
          },
        },
      },
    });
  }

  private async formulario(id: string, inst: string) {
    const f = await this.p.formulario.findFirst({
      where: { id, instituicaoId: inst, eliminadoEm: null },
    });

    if (!f) {
      throw new NotFoundException("Formulário não encontrado");
    }

    return f;
  }

  private async versao(inst: string, formularioId: string, vid: string) {
    await this.formulario(formularioId, inst);

    const v = await this.p.formularioVersao.findFirst({
      where: { id: vid, formularioId },
    });

    if (!v) {
      throw new NotFoundException("Versão não encontrada");
    }

    return v;
  }

  async criarFormulario(
    uid: string,
    dtoFormulario: CriarFormularioDto,
    versaoDto: CriarVersaoDto,
    etapaDto: CriarEtapaDto,
    secaoDto: CriarSecaoDto,
    campoDto: CriarCampoDto,
    opcaoDto: CriarOpcaoDto,
    regraDto: CriarRegraDto,
    dependenciaDto?: CriarDependenciaDto,
  ) {
    if (!uid) {
      throw new BadRequestException("Token inválido.");
    }

    try {
      return await this.p.$transaction(async (tx) => {
        const usuario = await tx.usuarioInstituicao.findFirst({
          where: { id: uid, eliminadoEm: null },
          select: { id: true, instituicaoId: true },
        });

        if (!usuario) {
          throw new ForbiddenException("Utilizador não encontrado.");
        }

        const formulario = await tx.formulario.create({
          data: {
            instituicaoId: usuario.instituicaoId,
            criadoPor: usuario.id,
            nome: dtoFormulario.nome,
            codigo: dtoFormulario.codigo,
            descricao: dtoFormulario.descricao,
            finalidade: dtoFormulario.finalidade,
            tipoAcesso: dtoFormulario.tipoAcesso ?? "PUBLICO",
            status: "RASCUNHO",
          },
        });

        const versao = await tx.formularioVersao.create({
          data: {
            formularioId: formulario.id,
            numero: 1, // formulário novo: primeira versão
            nome: versaoDto.nome,
            descricao: versaoDto.descricao,
            criadoPor: usuario.id,
            status: "RASCUNHO",
          },
        });

        const etapa = await tx.formularioEtapa.create({
          data: { ...etapaDto, formularioVersaoId: versao.id },
        });

        const secao = await tx.formularioSecao.create({
          data: { ...secaoDto, etapaId: etapa.id },
        });

        // ordem do campo: a do DTO, ou a próxima da seção
        const maxCampo = await tx.formularioCampo.aggregate({
          where: { secaoId: secao.id },
          _max: { ordem: true },
        });

        const campo = await tx.formularioCampo.create({
          data: {
            secaoId: secao.id,
            codigo: campoDto.codigo,
            nome: campoDto.nome,
            rotulo: campoDto.rotulo,
            descricao: campoDto.descricao,
            tipo: campoDto.tipo,
            ordem: campoDto.ordem ?? (maxCampo._max.ordem ?? 0) + 1,
            obrigatorio: campoDto.obrigatorio ?? false,
            visivel: campoDto.visivel ?? true,
            editavel: campoDto.editavel ?? true,
            configuracao: campoDto.configuracao,
            valorPadrao: campoDto.valorPadrao,
            placeholder: campoDto.placeholder,
          },
        });

        const opcao = await tx.campoOpcao.create({
          data: { ...opcaoDto, campoId: campo.id },
        });

        // ordem da regra: a do DTO, ou a próxima do campo
        const maxRegra = await tx.campoRegra.aggregate({
          where: { campoId: campo.id },
          _max: { ordem: true },
        });

        const regra = await tx.campoRegra.create({
          data: {
            campoId: campo.id,
            tipoRegra: regraDto.tipoRegra,
            valor: regraDto.valor,
            acao: regraDto.acao,
            mensagem: regraDto.mensagem,
            ordem: regraDto.ordem ?? (maxRegra._max.ordem ?? 0) + 1,
          },
        });

        let dependencia: CampoDependencia | null = null;

        if (dependenciaDto) {
          if (!dependenciaDto.campoOrigemId) {
            throw new BadRequestException("campoOrigemId é obrigatório.");
          }

          if (dependenciaDto.campoOrigemId === campo.id) {
            throw new BadRequestException(
              "Um campo não pode depender de si mesmo.",
            );
          }

          const origem = await tx.formularioCampo.findFirst({
            where: {
              id: dependenciaDto.campoOrigemId,
              secao: { etapa: { formularioVersaoId: versao.id } },
            },
            select: { id: true },
          });

          if (!origem) {
            throw new BadRequestException("Campo de origem inválido.");
          }

          dependencia = await tx.campoDependencia.create({
            data: {
              campoId: campo.id,
              campoOrigemId: origem.id,
              operador: dependenciaDto.operador,
              valor: dependenciaDto.valor,
              acao: dependenciaDto.acao,
            },
          });
        }

        return {
          formulario,
          versao,
          etapa,
          secao,
          campo,
          opcao,
          regra,
          dependencia,
        };
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("Já existe um registro com esse código.");
      }
      throw e;
    }
  }

  // publicar formulário
  async publicar(
    inst: string,
    id: string,
    vid: string,
    op: {
      dataInicio?: string;
      dataFim?: string;
      limiteSubmissoes?: number;
      urlBase?: string;
    },
  ) {
    const f = await this.formulario(id, inst);
    const v = await this.versao(inst, id, vid);

    const etapas = await this.p.formularioEtapa.count({
      where: { formularioVersaoId: vid },
    });

    if (etapas === 0) {
      throw new BadRequestException("A versão precisa de pelo menos uma etapa");
    }

    const campos = await this.p.formularioCampo.count({
      where: { secao: { etapa: { formularioVersaoId: vid } } },
    });

    if (campos === 0) {
      throw new BadRequestException("A versão precisa de pelo menos um campo");
    }

    const base = op.urlBase || "http://localhost:3000";

    let slug = slugify(`${f.nome}-${v.numero}`);
    let n = 1;

    while (await this.p.formularioLink.findUnique({ where: { slug } })) {
      slug = slugify(`${f.nome}-${v.numero}-${n++}`);
    }

    try {
      return await this.p.$transaction(async (tx) => {
        const pub = await tx.formularioPublicacao.create({
          data: {
            formularioId: id,
            formularioVersaoId: vid,
            dataInicio: op.dataInicio ? new Date(op.dataInicio) : new Date(),
            dataFim: op.dataFim ? new Date(op.dataFim) : undefined,
            limiteSubmissoes: op.limiteSubmissoes,
            status: "PUBLICADO",
          },
        });

        const link = await tx.formularioLink.create({
          data: {
            formularioId: id,
            publicacaoId: pub.id,
            slug,
            token: randomUUID(),
            urlPublica: `${base}/formularios/${slug}`,
            dataInicio: pub.dataInicio,
            dataFim: pub.dataFim,
          },
        });

        await tx.formularioVersao.update({
          where: { id: vid },
          data: { status: "PUBLICADO", publicadoEm: new Date() },
        });

        await tx.formulario.update({
          where: { id },
          data: {
            status: "PUBLICADO",
            versaoAtualId: vid,
            publicadoEm: new Date(),
          },
        });

        return {
          formulario: f.id,
          versao: v.id,
          publicacao: pub,
          link,
        };
      });
    } catch (e) {
      // slug gerado em paralelo por outra requisição
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("Já existe um link com esse slug.");
      }
      throw e;
    }
  }

  async submissoes(inst: string, id: string, paginacao?: PaginacaoDto) {
    const { page = 1, limit = 10 } = paginacao ?? {};
    const { skip, take } = getPaginationParams({ page, limit });

    await this.formulario(id, inst);

    const [data, total] = await this.p.$transaction([
      this.p.submissao.findMany({
        where: { formularioId: id },
        include: {
          respondente: true,
          respostas: { include: { campo: true } },
        },
        orderBy: { criadoEm: "desc" },
        skip,
        take,
      }),
      this.p.submissao.count({ where: { formularioId: id } }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}
