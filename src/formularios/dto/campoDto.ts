import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CriarEtapaDto {
  @IsString()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem!: number;

  @IsOptional()
  @IsBoolean()
  obrigatoria?: boolean;
}

export class CriarSecaoDto {
  @IsString()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem!: number;
}

export class CriarCampoDto {
  @IsString()
  codigo!: string;

  @IsString()
  nome!: string;

  @IsString()
  rotulo!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  tipo!: string;

  // opcional: o service calcula a próxima ordem se não vier
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem?: number;

  @IsOptional()
  @IsBoolean()
  obrigatorio?: boolean;

  @IsOptional()
  @IsBoolean()
  visivel?: boolean;

  @IsOptional()
  @IsBoolean()
  editavel?: boolean;

  @IsOptional()
  @IsObject()
  configuracao?: Prisma.InputJsonObject;

  @IsOptional()
  valorPadrao?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  placeholder?: string;
}

export class CriarOpcaoDto {
  @IsString()
  valor!: string;

  @IsString()
  rotulo!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem!: number;
}

export class CriarRegraDto {
  @IsString()
  tipoRegra!: string;

  @IsOptional()
  valor?: Prisma.InputJsonValue;

  @IsString()
  acao!: string;

  @IsOptional()
  @IsString()
  mensagem?: string;

  // opcional: o service calcula a próxima ordem se não vier
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem?: number;
}

export class CriarDependenciaDto {
  @IsString()
  campoOrigemId!: string;

  @IsString()
  operador!: string;

  @IsOptional()
  valor?: Prisma.InputJsonValue;

  @IsString()
  acao!: string;
}
