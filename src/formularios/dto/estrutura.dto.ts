import { IsBoolean, IsInt, IsJSON, IsOptional, IsString, Min } from 'class-validator';
export class CriarEtapaDto{@IsString()nome!:string;@IsOptional()@IsString()descricao?:string;@IsInt()@Min(1)ordem!:number;@IsOptional()@IsBoolean()obrigatoria?:boolean}
export class CriarSecaoDto{@IsString()nome!:string;@IsOptional()@IsString()descricao?:string;@IsInt()@Min(1)ordem!:number}
export class CriarCampoDto{@IsString()codigo!:string;@IsString()nome!:string;@IsString()rotulo!:string;@IsOptional()@IsString()descricao?:string;@IsString()tipo!:string;@IsInt()@Min(1)ordem!:number;@IsOptional()@IsBoolean()obrigatorio?:boolean;@IsOptional()@IsBoolean()visivel?:boolean;@IsOptional()@IsBoolean()editavel?:boolean;@IsOptional()configuracao?:any;@IsOptional()valorPadrao?:any;@IsOptional()@IsString()placeholder?:string}
export class CriarOpcaoDto{@IsString()valor!:string;@IsString()rotulo!:string;@IsOptional()@IsString()descricao?:string;@IsInt()@Min(1)ordem!:number}
export class CriarRegraDto{@IsString()tipoRegra!:string;@IsOptional()valor?:any;@IsString()acao!:string;@IsOptional()@IsString()mensagem?:string;@IsOptional()@IsInt()ordem?:number}
export class CriarDependenciaDto{@IsString()campoOrigemId!:string;@IsString()operador!:string;@IsOptional()valor?:any;@IsString()acao!:string}
