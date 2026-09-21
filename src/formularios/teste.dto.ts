import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { CriarFormularioDto } from "./dto/criar-formulario.dto";
import { CriarVersaoDto } from "./dto/criar-versao.dto";
import {
  CriarCampoDto,
  CriarDependenciaDto,
  CriarEtapaDto,
  CriarOpcaoDto,
  CriarRegraDto,
  CriarSecaoDto,
} from "./dto/campoDto";

export class CriarFormularioCompletoDto {
  @ValidateNested()
  @Type(() => CriarFormularioDto)
  formulario!: CriarFormularioDto;

  @ValidateNested()
  @Type(() => CriarVersaoDto)
  versao!: CriarVersaoDto;

  @ValidateNested()
  @Type(() => CriarEtapaDto)
  etapa!: CriarEtapaDto;

  @ValidateNested()
  @Type(() => CriarSecaoDto)
  secao!: CriarSecaoDto;

  @ValidateNested()
  @Type(() => CriarCampoDto)
  campo!: CriarCampoDto;

  @ValidateNested()
  @Type(() => CriarOpcaoDto)
  opcao!: CriarOpcaoDto;

  @ValidateNested()
  @Type(() => CriarRegraDto)
  regra!: CriarRegraDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CriarDependenciaDto)
  dependencia?: CriarDependenciaDto;
}
