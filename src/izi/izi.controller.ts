import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common'; import { IziService } from './izi.service'; import { AuthGuard } from '../common/auth.guard'; import { CriarUtilizadorIziDto } from './dto/criar-utilizador.dto'; import { LoginIziDto } from './dto/login-izi.dto';
@Controller('izi') export class IziController{constructor(private s:IziService){}
@Post('auth/login') login(@Body()d:LoginIziDto){return this.s.login(d)}
@UseGuards(AuthGuard) @Post('utilizadores') criar(@Req()r:any,@Body()d:CriarUtilizadorIziDto){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.criarUtilizador(d)}
@UseGuards(AuthGuard) @Get('utilizadores') listar(@Req()r:any){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.listarUtilizadores()}
@UseGuards(AuthGuard) @Get('instituicoes') instituicoes(@Req()r:any,@Query('status')status?:string){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.listarInstituicoes(status)}
@UseGuards(AuthGuard) @Patch('instituicoes/:id/aprovar') aprovar(@Req()r:any,@Param('id')id:string){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.aprovarInstituicao(id)}
@UseGuards(AuthGuard) @Patch('instituicoes/:id/rejeitar') rejeitar(@Req()r:any,@Param('id')id:string){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.rejeitarInstituicao(id)}
@UseGuards(AuthGuard) @Patch('instituicoes/:id/suspender') suspender(@Req()r:any,@Param('id')id:string){if(r.user.portal!=='IZI')throw new ForbiddenException('Portal inválido');return this.s.suspenderInstituicao(id)}
}
