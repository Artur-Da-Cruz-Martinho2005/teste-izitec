import { Body, Controller, Get, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common'; import { InstituicoesService } from './instituicoes.service'; import { RegistrarInstituicaoDto } from './dto/registrar-instituicao.dto'; import { LoginInstituicaoDto } from './dto/login-instituicao.dto'; import { CriarUtilizadorInstituicaoDto } from './dto/criar-utilizador.dto'; import { AuthGuard } from '../common/auth.guard';
@Controller('instituicoes') export class InstituicoesController{constructor(private s:InstituicoesService){}
@Post('auth/register') registrar(@Body()d:RegistrarInstituicaoDto){return this.s.registrar(d)}
@Post('auth/login') login(@Body()d:LoginInstituicaoDto){return this.s.login(d)}
@UseGuards(AuthGuard) @Post('utilizadores') criar(@Req()r:any,@Body()d:CriarUtilizadorInstituicaoDto){if(r.user.portal!=='INSTITUICAO')throw new ForbiddenException('Portal inválido');return this.s.criarUtilizador(r.user.instituicaoId,d)}
@UseGuards(AuthGuard) @Get('utilizadores') listar(@Req()r:any){if(r.user.portal!=='INSTITUICAO')throw new ForbiddenException('Portal inválido');return this.s.listarUtilizadores(r.user.instituicaoId)}
}
