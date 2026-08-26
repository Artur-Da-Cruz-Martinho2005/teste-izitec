import { IsOptional, IsString } from 'class-validator'; export class CriarVersaoDto{@IsOptional()@IsString() nome?:string;@IsOptional()@IsString() descricao?:string;}
