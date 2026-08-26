import { Body, Controller, Get, Param, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common'; import { AuthGuard } from '../common/auth.guard'; import { FormulariosService } from './formularios.service'; import { CriarFormularioDto } from './dto/criar-formulario.dto'; import { CriarVersaoDto } from './dto/criar-versao.dto'; import { CriarCampoDto, CriarDependenciaDto, CriarEtapaDto, CriarOpcaoDto, CriarRegraDto, CriarSecaoDto } from './dto/estrutura.dto';
@Controller('instituicoes/formularios') @UseGuards(AuthGuard) export class FormulariosController{constructor(private s:FormulariosService){} private auth(r:any){if(r.user.portal!=='INSTITUICAO')throw new ForbiddenException('Portal inválido');return r.user}
@Post() criar(@Req()r:any,@Body()d:CriarFormularioDto){const u=this.auth(r);return this.s.criar(u.instituicaoId,u.sub,d)}
@Get() listar(@Req()r:any){return this.s.listar(this.auth(r).instituicaoId)}
@Get(':id') detalhe(@Req()r:any,@Param('id')id:string){return this.s.detalhe(this.auth(r).instituicaoId,id)}
@Post(':id/versoes') versao(@Req()r:any,@Param('id')id:string,@Body()d:CriarVersaoDto){const u=this.auth(r);return this.s.criarVersao(u.instituicaoId,u.sub,id,d)}
@Post(':id/versoes/:vid/etapas') etapa(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Body()d:CriarEtapaDto){return this.s.etapa(this.auth(r).instituicaoId,id,vid,d)}
@Post(':id/versoes/:vid/etapas/:eid/secoes') secao(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Param('eid')eid:string,@Body()d:CriarSecaoDto){return this.s.secao(this.auth(r).instituicaoId,id,vid,eid,d)}
@Post(':id/versoes/:vid/secoes/:sid/campos') campo(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Param('sid')sid:string,@Body()d:CriarCampoDto){return this.s.campo(this.auth(r).instituicaoId,id,vid,sid,d)}
@Post(':id/versoes/:vid/campos/:cid/opcoes') opcao(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Param('cid')cid:string,@Body()d:CriarOpcaoDto){return this.s.opcao(this.auth(r).instituicaoId,id,vid,cid,d)}
@Post(':id/versoes/:vid/campos/:cid/regras') regra(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Param('cid')cid:string,@Body()d:CriarRegraDto){return this.s.regra(this.auth(r).instituicaoId,id,vid,cid,d)}
@Post(':id/versoes/:vid/campos/:cid/dependencias') dependencia(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Param('cid')cid:string,@Body()d:CriarDependenciaDto){return this.s.dependencia(this.auth(r).instituicaoId,id,vid,cid,d)}
@Post(':id/versoes/:vid/publicar') publicar(@Req()r:any,@Param('id')id:string,@Param('vid')vid:string,@Body()d:any){return this.s.publicar(this.auth(r).instituicaoId,id,vid,d)}
@Get(':id/submissoes') submissoes(@Req()r:any,@Param('id')id:string){return this.s.submissoes(this.auth(r).instituicaoId,id)}
}
