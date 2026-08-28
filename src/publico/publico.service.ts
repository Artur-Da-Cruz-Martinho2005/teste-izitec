import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as crypto from "crypto";
@Injectable()
export class PublicoService {
  constructor(private p: PrismaService) {}
  async obter(slug: string) {
    const link = await this.p.formularioLink.findUnique({
      where: { slug },
      include: {
        formulario: {
          include: {
            instituicao: {
              select: { id: true, nome: true, nomeComercial: true, logo: true },
            },
          },
        },
        publicacao: {
          include: {
            versao: {
              include: {
                etapas: {
                  orderBy: { ordem: "asc" },
                  include: {
                    secoes: {
                      orderBy: { ordem: "asc" },
                      include: {
                        campos: {
                          where: { status: "ATIVO" },
                          orderBy: { ordem: "asc" },
                          include: {
                            opcoes: {
                              where: { status: "ATIVO" },
                              orderBy: { ordem: "asc" },
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
          },
        },
      },
    });
    if (!link || link.status !== "ATIVO")
      throw new NotFoundException("Formulário público não encontrado");
    this.verificarPublicacao(
      link.publicacao.dataInicio,
      link.publicacao.dataFim,
    );
    return {
      formulario: {
        id: link.formulario.id,
        nome: link.formulario.nome,
        descricao: link.formulario.descricao,
        finalidade: link.formulario.finalidade,
      },
      instituicao: link.formulario.instituicao,
      versao: link.publicacao.versao,
      link: { slug: link.slug, url: link.urlPublica },
    };
  }
  private verificarPublicacao(inicio: Date | null, fim: Date | null) {
    const now = new Date();
    if (inicio && now < inicio)
      throw new GoneException("Formulário ainda não está disponível");
    if (fim && now > fim) throw new GoneException("Formulário encerrado");
  }
  private validarCampo(c: any, v: any) {
    if (c.obrigatorio && (v === undefined || v === null || v === ""))
      throw new BadRequestException(`Campo obrigatório: ${c.rotulo}`);
    if (v === undefined || v === null || v === "") return;
    const n = Number(v);
    if (
      ["numero", "decimal", "moeda", "percentagem"].includes(c.tipo) &&
      Number.isNaN(n)
    )
      throw new BadRequestException(`Valor inválido para: ${c.rotulo}`);
    if (c.tipo === "email" && !/^\S+@\S+\.\S+$/.test(String(v)))
      throw new BadRequestException(`Email inválido: ${c.rotulo}`);
    if (
      ["select", "radio"].includes(c.tipo) &&
      c.opcoes.length &&
      !c.opcoes.some((o: any) => o.valor === String(v))
    )
      throw new BadRequestException(`Opção inválida: ${c.rotulo}`);
    if (
      c.tipo === "checkbox" &&
      Array.isArray(v) &&
      c.opcoes.length &&
      v.some((x) => !c.opcoes.some((o: any) => o.valor === String(x)))
    )
      throw new BadRequestException(`Opção inválida: ${c.rotulo}`);
    for (const r of c.regras || []) {
      const x = String(v);
      if (r.tipoRegra === "MIN" && n < Number(r.valor))
        throw new BadRequestException(
          r.mensagem || `Valor mínimo: ${c.rotulo}`,
        );
      if (r.tipoRegra === "MAX" && n > Number(r.valor))
        throw new BadRequestException(
          r.mensagem || `Valor máximo: ${c.rotulo}`,
        );
      if (r.tipoRegra === "MIN_LENGTH" && x.length < Number(r.valor))
        throw new BadRequestException(
          r.mensagem || `Tamanho mínimo: ${c.rotulo}`,
        );
      if (r.tipoRegra === "MAX_LENGTH" && x.length > Number(r.valor))
        throw new BadRequestException(
          r.mensagem || `Tamanho máximo: ${c.rotulo}`,
        );
      if (
        r.tipoRegra === "REGEX" &&
        r.valor &&
        !new RegExp(String(r.valor)).test(x)
      )
        throw new BadRequestException(
          r.mensagem || `Formato inválido: ${c.rotulo}`,
        );
    }
  }
  private campoAtivo(c: any, mapa: Map<string, any>) {
    for (const d of c.dependencias || []) {
      const atual = mapa.get(d.campoOrigemId);
      const alvo = d.valor;
      let ok = false;
      switch (d.operador) {
        case "IGUAL":
          ok = JSON.stringify(atual) === JSON.stringify(alvo);
          break;
        case "DIFERENTE":
          ok = JSON.stringify(atual) !== JSON.stringify(alvo);
          break;
        case "CONTEM":
          ok = Array.isArray(atual)
            ? atual.map(String).includes(String(alvo))
            : String(atual ?? "").includes(String(alvo));
          break;
        case "MAIOR":
          ok = Number(atual) > Number(alvo);
          break;
        case "MENOR":
          ok = Number(atual) < Number(alvo);
          break;
        default:
          ok = false;
      }
      if (d.acao === "MOSTRAR" && !ok) return false;
      if (d.acao === "OCULTAR" && ok) return false;
    }
    return true;
  }
  async submeter(slug: string, d: any, req: any) {
    const link = await this.p.formularioLink.findUnique({
      where: { slug },
      include: {
        publicacao: {
          include: {
            versao: {
              include: {
                etapas: {
                  include: {
                    secoes: {
                      include: {
                        campos: {
                          where: { status: "ATIVO" },
                          include: {
                            opcoes: true,
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
          },
        },
      },
    });
    if (!link) throw new NotFoundException("Formulário não encontrado");
    this.verificarPublicacao(
      link.publicacao.dataInicio,
      link.publicacao.dataFim,
    );
    const pub = link.publicacao;
    if (
      pub.limiteSubmissoes !== null &&
      pub.totalSubmissoes >= pub.limiteSubmissoes
    )
      throw new GoneException("Limite de submissões atingido");
    const campos: any[] = [];
    for (const e of pub.versao.etapas)
      for (const s of e.secoes) for (const c of s.campos) campos.push(c);
    const respostas = d.respostas || [];
    const mapa = new Map<string, any>(
      respostas.map((x: any) => [x.campoId, x.valor]),
    );
    for (const c of campos) {
      if (this.campoAtivo(c, mapa)) this.validarCampo(c, mapa.get(c.id));
    }
    const codigo = `SUB-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const respondente = d.respondente
      ? await this.p.respondente.create({
          data: {
            nome: d.respondente.nome,
            email: d.respondente.email,
            telefone: d.respondente.telefone,
            identificador: d.respondente.identificador,
          },
        })
      : null;
    const submissao = await this.p.$transaction(async (tx) => {
      const sub = await tx.submissao.create({
        data: {
          formularioId: link.formularioId,
          formularioVersaoId: pub.formularioVersaoId,
          publicacaoId: pub.id,
          respondenteId: respondente?.id,
          codigo,
          status: "SUBMETIDA",
          ip: req?.ip,
          userAgent: req?.headers?.["user-agent"],
          submetidoEm: new Date(),
        },
      });
      for (const c of campos) {
        const v = mapa.get(c.id);
        if (v === undefined || v === null || v === "") continue;
        const data: any = { submissaoId: sub.id, campoId: c.id };
        if (typeof v === "string") data.valorTexto = v;
        else if (typeof v === "number") data.valorDecimal = v;
        else if (typeof v === "boolean") data.valorBooleano = v;
        else data.valorJson = v;
        await tx.submissaoResposta.create({ data });
      }
      await tx.formularioPublicacao.update({
        where: { id: pub.id },
        data: { totalSubmissoes: { increment: 1 } },
      });
      return sub;
    });
    return {
      mensagem: "Formulário submetido com sucesso",
      submissaoId: submissao.id,
      codigo: submissao.codigo,
    };
  }
}
