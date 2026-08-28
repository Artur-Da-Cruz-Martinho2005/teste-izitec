import * as crypto from "crypto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { slugify } from "../common/slug";

import { CriarFormularioDto } from "./dto/criar-formulario.dto";
import { CriarVersaoDto } from "./dto/criar-versao.dto";
import { PaginacaoDto } from "src/common/paginacao.dto";
import { getPaginationParams, buildPaginationMeta } from "../common/paginacao";
import {
  CriarCampoDto,
  CriarDependenciaDto,
  CriarEtapaDto,
  CriarOpcaoDto,
  CriarRegraDto,
  CriarSecaoDto,
} from "./dto/estrutura.dto";

@Injectable()
export class FormulariosService {
  constructor(private p: PrismaService) {}

  private async formulario(id: string, inst: string) {
    const f = await this.p.formulario.findFirst({
      where: {
        id,
        instituicaoId: inst,
        eliminadoEm: null,
      },
    });

    if (!f) {
      throw new NotFoundException("Formulário não encontrado");
    }

    return f;
  }

  async criar(inst: string, uid: string, d: CriarFormularioDto) {
    const existente = await this.p.formulario.findUnique({
      where: {
        instituicaoId_codigo: {
          instituicaoId: inst,
          codigo: d.codigo,
        },
      },
    });

    if (existente) {
      throw new ConflictException("Código já utilizado");
    }

    return this.p.formulario.create({
      data: {
        instituicaoId: inst,
        criadoPor: uid,
        nome: d.nome,
        codigo: d.codigo,
        descricao: d.descricao,
        finalidade: d.finalidade,
        tipoAcesso: d.tipoAcesso || "PUBLICO",
        status: "RASCUNHO",
      },
    });
  }

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

  async criarVersao(inst: string, uid: string, id: string, d: CriarVersaoDto) {
    await this.formulario(id, inst);

    const last = await this.p.formularioVersao.findFirst({
      where: {
        formularioId: id,
      },
      orderBy: {
        numero: "desc",
      },
    });

    return this.p.formularioVersao.create({
      data: {
        formularioId: id,
        numero: (last?.numero || 0) + 1,
        nome: d.nome,
        descricao: d.descricao,
        criadoPor: uid,
        status: "RASCUNHO",
      },
    });
  }

  private async versao(inst: string, id: string, vid: string) {
    const v = await this.p.formularioVersao.findFirst({
      where: {
        id: vid,
        formularioId: id,
        formulario: {
          instituicaoId: inst,
        },
      },
    });

    if (!v) {
      throw new NotFoundException("Versão não encontrada");
    }

    if (v.status === "PUBLICADO") {
      throw new BadRequestException("Versão publicada não pode ser alterada");
    }

    return v;
  }

  async etapa(inst: string, id: string, vid: string, d: CriarEtapaDto) {
    await this.versao(inst, id, vid);

    return this.p.formularioEtapa.create({
      data: {
        formularioVersaoId: vid,
        ...d,
      },
    });
  }

  async secao(
    inst: string,
    id: string,
    vid: string,
    eid: string,
    d: CriarSecaoDto,
  ) {
    await this.versao(inst, id, vid);

    const e = await this.p.formularioEtapa.findFirst({
      where: {
        id: eid,
        formularioVersaoId: vid,
      },
    });

    if (!e) {
      throw new NotFoundException("Etapa não encontrada");
    }

    return this.p.formularioSecao.create({
      data: {
        etapaId: eid,
        ...d,
      },
    });
  }

  async campo(
    inst: string,
    id: string,
    vid: string,
    sid: string,
    d: CriarCampoDto,
  ) {
    await this.versao(inst, id, vid);

    const s = await this.p.formularioSecao.findFirst({
      where: {
        id: sid,
        etapa: {
          formularioVersaoId: vid,
        },
      },
    });

    if (!s) {
      throw new NotFoundException("Secção não encontrada");
    }

    return this.p.formularioCampo.create({
      data: {
        secaoId: sid,
        codigo: d.codigo,
        nome: d.nome,
        rotulo: d.rotulo,
        descricao: d.descricao,
        tipo: d.tipo,
        ordem: d.ordem,
        obrigatorio: d.obrigatorio ?? false,
        visivel: d.visivel ?? true,
        editavel: d.editavel ?? true,
        configuracao: d.configuracao,
        valorPadrao: d.valorPadrao,
        placeholder: d.placeholder,
      },
    });
  }

  async opcao(
    inst: string,
    id: string,
    vid: string,
    cid: string,
    d: CriarOpcaoDto,
  ) {
    await this.versao(inst, id, vid);

    const c = await this.p.formularioCampo.findFirst({
      where: {
        id: cid,
        secao: {
          etapa: {
            formularioVersaoId: vid,
          },
        },
      },
    });

    if (!c) {
      throw new NotFoundException("Campo não encontrado");
    }

    return this.p.campoOpcao.create({
      data: {
        campoId: cid,
        ...d,
      },
    });
  }

  async regra(
    inst: string,
    id: string,
    vid: string,
    cid: string,
    d: CriarRegraDto,
  ) {
    await this.versao(inst, id, vid);

    const c = await this.p.formularioCampo.findFirst({
      where: {
        id: cid,
        secao: {
          etapa: {
            formularioVersaoId: vid,
          },
        },
      },
    });

    if (!c) {
      throw new NotFoundException("Campo não encontrado");
    }

    return this.p.campoRegra.create({
      data: {
        campoId: cid,
        tipoRegra: d.tipoRegra,
        valor: d.valor,
        acao: d.acao,
        mensagem: d.mensagem,
        ordem: d.ordem ?? 1,
      },
    });
  }

  async dependencia(
    inst: string,
    id: string,
    vid: string,
    cid: string,
    d: CriarDependenciaDto,
  ) {
    await this.versao(inst, id, vid);

    const c = await this.p.formularioCampo.findFirst({
      where: {
        id: cid,
        secao: {
          etapa: {
            formularioVersaoId: vid,
          },
        },
      },
    });

    const o = await this.p.formularioCampo.findFirst({
      where: {
        id: d.campoOrigemId,
        secao: {
          etapa: {
            formularioVersaoId: vid,
          },
        },
      },
    });

    if (!c || !o) {
      throw new NotFoundException("Campo não encontrado");
    }

    if (c.id === o.id) {
      throw new BadRequestException("Um campo não pode depender de si próprio");
    }

    return this.p.campoDependencia.create({
      data: {
        campoId: cid,
        campoOrigemId: d.campoOrigemId,
        operador: d.operador,
        valor: d.valor,
        acao: d.acao,
      },
    });
  }

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

    const estrutura = await this.p.formularioEtapa.count({
      where: {
        formularioVersaoId: vid,
      },
    });

    if (estrutura === 0) {
      throw new BadRequestException("A versão precisa de pelo menos uma etapa");
    }

    const campos = await this.p.formularioCampo.count({
      where: {
        secao: {
          etapa: {
            formularioVersaoId: vid,
          },
        },
      },
    });

    if (campos === 0) {
      throw new BadRequestException("A versão precisa de pelo menos um campo");
    }

    const base = op.urlBase || "http://localhost:3000";

    let slug = slugify(`${f.nome}-${v.numero}`);
    let n = 1;

    while (
      await this.p.formularioLink.findUnique({
        where: {
          slug,
        },
      })
    ) {
      slug = slugify(`${f.nome}-${v.numero}-${n++}`);
    }

    return this.p.$transaction(async (tx) => {
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
          token: crypto.randomUUID(),
          urlPublica: `${base}/formularios/${slug}`,
          dataInicio: pub.dataInicio,
          dataFim: pub.dataFim,
        },
      });

      await tx.formularioVersao.update({
        where: {
          id: vid,
        },
        data: {
          status: "PUBLICADO",
          publicadoEm: new Date(),
        },
      });

      await tx.formulario.update({
        where: {
          id,
        },
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
  }

  async submissoes(inst: string, id: string, paginacao?: PaginacaoDto) {
    // paginacao para criar limites de dados
    const { page = 1, limit = 10 } = paginacao ?? {};
    const { skip, take } = getPaginationParams({ page, limit });
    await this.formulario(id, inst);
    const [data, total] = await this.p.$transaction([
      this.p.submissao.findMany({
        where: {
          formularioId: id,
        },
        include: {
          respondente: true,
          respostas: {
            include: {
              campo: true,
            },
          },
        },
        orderBy: {
          criadoEm: "desc",
        },
        skip,
        take,
      }),
      this.p.submissao.count({
        where: {
          formularioId: id,
        },
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}
