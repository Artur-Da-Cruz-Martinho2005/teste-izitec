import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma.service";
import { RegistrarInstituicaoDto } from "./dto/registrar-instituicao.dto";
import { LoginInstituicaoDto } from "./dto/login-instituicao.dto";
import { CriarUtilizadorInstituicaoDto } from "./dto/criar-utilizador.dto";
@Injectable()
export class InstituicoesService {
  constructor(
    private p: PrismaService,
    private jwt: JwtService,
  ) {}
  async registrar(d: RegistrarInstituicaoDto) {
    if (
      await this.p.instituicao.findFirst({
        where: { OR: [{ email: d.email }, ...(d.nif ? [{ nif: d.nif }] : [])] },
      })
    )
      throw new ConflictException("Instituição já registada");
    if (
      await this.p.usuarioInstituicao.findFirst({
        where: { email: d.responsavelEmail },
      })
    )
      throw new ConflictException("Email do responsável já utilizado");
    const hash = await bcrypt.hash(d.responsavelSenha, 10);
    return this.p.$transaction(async (tx) => {
      const i = await tx.instituicao.create({
        data: {
          nome: d.nome,
          nomeComercial: d.nomeComercial,
          sigla: d.sigla,
          tipo: d.tipo,
          nif: d.nif,
          email: d.email,
          telefone: d.telefone,
          website: d.website,
          provincia: d.provincia,
          municipio: d.municipio,
          endereco: d.endereco,
          status: "PENDENTE",
        },
      });
      const u = await tx.usuarioInstituicao.create({
        data: {
          instituicaoId: i.id,
          nome: d.responsavelNome,
          apelido: d.responsavelApelido,
          email: d.responsavelEmail,
          telefone: d.responsavelTelefone,
          senha: hash,
          cargo: "Administrador",
          status: "PENDENTE",
        },
      });
      const perfil = await tx.perfilInstituicao.create({
        data: {
          instituicaoId: i.id,
          nome: "Administrador",
          descricao: "Administrador da instituição",
        },
      });
      await tx.usuarioPerfilInstituicao.create({
        data: { usuarioInstituicaoId: u.id, perfilInstituicaoId: perfil.id },
      });
      return {
        instituicao: { id: i.id, nome: i.nome, status: i.status },
        responsavel: {
          id: u.id,
          nome: u.nome,
          email: u.email,
          status: u.status,
        },
      };
    });
  }
  async login(d: LoginInstituicaoDto) {
    const u = await this.p.usuarioInstituicao.findFirst({
      where: { email: d.email, eliminadoEm: null },
      include: { instituicao: true },
    });
    if (!u || !(await bcrypt.compare(d.senha, u.senha)))
      throw new UnauthorizedException("Credenciais inválidas");
    if (u.instituicao.status !== "ATIVO")
      throw new ForbiddenException(
        `Instituição ainda não está ativa. Estado: ${u.instituicao.status}`,
      );
    if (u.status !== "ATIVO")
      await this.p.usuarioInstituicao.update({
        where: { id: u.id },
        data: { status: "ATIVO" },
      });
    await this.p.usuarioInstituicao.update({
      where: { id: u.id },
      data: { ultimoAcessoEm: new Date(), status: "ATIVO" },
    });
    return {
      access_token: this.jwt.sign({
        sub: u.id,
        portal: "INSTITUICAO",
        instituicaoId: u.instituicaoId,
      }),
      utilizador: { id: u.id, nome: u.nome, email: u.email, cargo: u.cargo },
      instituicao: {
        id: u.instituicao.id,
        nome: u.instituicao.nome,
        status: u.instituicao.status,
      },
    };
  }
  async criarUtilizador(instId: string, d: CriarUtilizadorInstituicaoDto) {
    if (
      await this.p.usuarioInstituicao.findUnique({
        where: {
          instituicaoId_email: { instituicaoId: instId, email: d.email },
        },
      })
    )
      throw new ConflictException("Email já utilizado nesta instituição");
    const u = await this.p.usuarioInstituicao.create({
      data: {
        instituicaoId: instId,
        nome: d.nome,
        apelido: d.apelido,
        email: d.email,
        telefone: d.telefone,
        senha: await bcrypt.hash(d.senha, 10),
        cargo: d.cargo,
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
  async listarUtilizadores(instId: string) {
    return this.p.usuarioInstituicao.findMany({
      where: { instituicaoId: instId, eliminadoEm: null },
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
}
