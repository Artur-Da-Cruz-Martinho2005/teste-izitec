import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service";
import { CriarUtilizadorIziDto } from "./dto/criar-utilizador.dto";
import { LoginIziDto } from "./dto/login-izi.dto";
import { PaginacaoDto } from "../common/paginacao.dto";
import { getPaginationParams, buildPaginationMeta } from "../common/paginacao";
@Injectable()
export class IziService {
  constructor(
    private p: PrismaService,
    private jwt: JwtService,
  ) {}
  async login(dto: LoginIziDto) {
    const u = await this.p.usuarioIzi.findUnique({
      where: { email: dto.email },
    });
    if (!u || !(await bcrypt.compare(dto.senha, u.senha)))
      throw new UnauthorizedException("Credenciais inválidas");
    if (u.status !== "ATIVO")
      throw new ForbiddenException("Utilizador IZI não está ativo");
    await this.p.usuarioIzi.update({
      where: { id: u.id },
      data: { ultimoAcessoEm: new Date() },
    });
    return {
      access_token: this.jwt.sign({ sub: u.id, portal: "IZI", email: u.email }),
      utilizador: { id: u.id, nome: u.nome, email: u.email, cargo: u.cargo },
    };
  }
  async criarUtilizador(dto: CriarUtilizadorIziDto) {
    if (await this.p.usuarioIzi.findUnique({ where: { email: dto.email } }))
      throw new ConflictException("Email já utilizado");
    const u = await this.p.usuarioIzi.create({
      data: {
        ...dto,
        senha: await bcrypt.hash(dto.senha, 10),
        status: "ATIVO",
      },
    });
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      cargo: u.cargo,
      status: u.status,
    };
  }
  async listarUtilizadores() {
    return this.p.usuarioIzi.findMany({
      where: { eliminadoEm: null },
      select: {
        id: true,
        nome: true,
        apelido: true,
        email: true,
        telefone: true,
        cargo: true,
        status: true,
        criadoEm: true,
      },
    });
  }
  async listarInstituicoes(status?: any, paginacao?: PaginacaoDto) {
    //paginacao para criar limites de dados
    const { page = 1, limit = 10 } = paginacao ?? {};
    const { skip, take } = getPaginationParams({ page, limit });

    const [data, total] = await this.p.$transaction([
      this.p.instituicao.findMany({
        where: status ? { status } : undefined,
        orderBy: { criadoEm: "desc" },
        skip,
        take,
      }),
      this.p.instituicao.count({
        where: status ? { status } : undefined, // mesmo filtro do findMany!
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
  async aprovarInstituicao(id: string) {
    const i = await this.p.instituicao.findUnique({ where: { id } });
    if (!i) throw new NotFoundException("Instituição não encontrada");
    if (i.status === "ATIVO") return i;
    return this.p.instituicao.update({
      where: { id },
      data: { status: "ATIVO" },
    });
  }
  async rejeitarInstituicao(id: string) {
    const i = await this.p.instituicao.findUnique({ where: { id } });
    if (!i) throw new NotFoundException("Instituição não encontrada");
    return this.p.instituicao.update({
      where: { id },
      data: { status: "REJEITADO" },
    });
  }
  async suspenderInstituicao(id: string) {
    const i = await this.p.instituicao.findUnique({ where: { id } });
    if (!i) throw new NotFoundException("Instituição não encontrada");
    return this.p.instituicao.update({
      where: { id },
      data: { status: "SUSPENSO" },
    });
  }
}
