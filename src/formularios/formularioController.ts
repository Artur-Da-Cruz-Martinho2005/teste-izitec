import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "../common/auth.guard";
import { PaginacaoDto } from "../common/paginacao.dto";
import { formularioService } from "./formularios.service";
import { CriarFormularioCompletoDto } from "./teste.dto";

interface RequestComUsuario {
  user: {
    id?: string;
    sub?: string;
    instituicaoId?: string;
  };
}

@UseGuards(AuthGuard)
@Controller("instituicoes/formularios")
export class formularioController {
  constructor(private readonly service: formularioService) {}

  private uid(req: RequestComUsuario): string {
    const uid = req.user.id ?? req.user.sub;
    if (!uid) throw new UnauthorizedException("Token inválido.");
    return uid;
  }

  private inst(req: RequestComUsuario): string {
    const inst = req.user.instituicaoId;
    if (!inst) throw new UnauthorizedException("Token sem instituição.");
    return inst;
  }

  @Post()
  criar(
    @Req() req: RequestComUsuario,
    @Body() body: CriarFormularioCompletoDto,
  ) {
    return this.service.criarFormulario(
      this.uid(req),
      body.formulario,
      body.versao,
      body.etapa,
      body.secao,
      body.campo,
      body.opcao,
      body.regra,
      body.dependencia, // opcional
    );
  }

  @Get()
  listar(@Req() req: RequestComUsuario, @Query() paginacao: PaginacaoDto) {
    return this.service.listar(this.inst(req), paginacao);
  }

  @Get(":id")
  detalhe(
    @Req() req: RequestComUsuario,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.detalhe(this.inst(req), id);
  }

  @Post(":id/versoes/:vid/publicar")
  publicar(
    @Req() req: RequestComUsuario,
    @Param("id", ParseUUIDPipe) id: string,
    @Param("vid", ParseUUIDPipe) vid: string,
    @Body() body: any,
  ) {
    return this.service.publicar(this.inst(req), id, vid, body);
  }

  @Get(":id/submissoes")
  submissoes(
    @Req() req: RequestComUsuario,
    @Param("id", ParseUUIDPipe) id: string,
    @Query() paginacao: PaginacaoDto,
  ) {
    return this.service.submissoes(this.inst(req), id, paginacao);
  }
}
