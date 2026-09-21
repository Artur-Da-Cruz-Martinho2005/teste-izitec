import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
export class CriarFormularioDto {
  @IsString() @MaxLength(200) nome!: string;
  @IsString() @MaxLength(100) codigo!: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() finalidade?: string;
  @IsOptional() @IsEnum(["PUBLICO", "PRIVADO"] as any) tipoAcesso?: any;
}
