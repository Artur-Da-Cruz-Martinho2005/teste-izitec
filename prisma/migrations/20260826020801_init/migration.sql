-- CreateEnum
CREATE TYPE "StatusGeral" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO', 'PENDENTE', 'REJEITADO', 'RASCUNHO', 'PUBLICADO', 'ENCERRADO', 'SUBMETIDA');

-- CreateEnum
CREATE TYPE "TipoAcesso" AS ENUM ('PUBLICO', 'PRIVADO');

-- CreateTable
CREATE TABLE "UsuarioIzi" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "cargo" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "emailVerificadoEm" TIMESTAMP(3),
    "ultimoAcessoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "eliminadoEm" TIMESTAMP(3),

    CONSTRAINT "UsuarioIzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilIzi" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilIzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissaoIzi" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissaoIzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioPerfilIzi" (
    "id" TEXT NOT NULL,
    "usuarioIziId" TEXT NOT NULL,
    "perfilIziId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioPerfilIzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilPermissaoIzi" (
    "id" TEXT NOT NULL,
    "perfilIziId" TEXT NOT NULL,
    "permissaoIziId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerfilPermissaoIzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instituicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeComercial" TEXT,
    "sigla" TEXT,
    "tipo" TEXT NOT NULL,
    "nif" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "telefoneAlternativo" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "descricao" TEXT,
    "pais" TEXT,
    "provincia" TEXT,
    "municipio" TEXT,
    "endereco" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "eliminadoEm" TIMESTAMP(3),

    CONSTRAINT "Instituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioInstituicao" (
    "id" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "cargo" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'PENDENTE',
    "emailVerificadoEm" TIMESTAMP(3),
    "ultimoAcessoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "eliminadoEm" TIMESTAMP(3),

    CONSTRAINT "UsuarioInstituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilInstituicao" (
    "id" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilInstituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissaoInstituicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissaoInstituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioPerfilInstituicao" (
    "id" TEXT NOT NULL,
    "usuarioInstituicaoId" TEXT NOT NULL,
    "perfilInstituicaoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioPerfilInstituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilPermissaoInstituicao" (
    "id" TEXT NOT NULL,
    "perfilInstituicaoId" TEXT NOT NULL,
    "permissaoInstituicaoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerfilPermissaoInstituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formulario" (
    "id" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "finalidade" TEXT,
    "tipoAcesso" "TipoAcesso" NOT NULL DEFAULT 'PUBLICO',
    "status" "StatusGeral" NOT NULL DEFAULT 'RASCUNHO',
    "versaoAtualId" TEXT,
    "criadoPor" TEXT NOT NULL,
    "publicadoEm" TIMESTAMP(3),
    "encerradoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "eliminadoEm" TIMESTAMP(3),

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioVersao" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" TEXT,
    "descricao" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'RASCUNHO',
    "publicadoEm" TIMESTAMP(3),
    "criadoPor" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioVersao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioEtapa" (
    "id" TEXT NOT NULL,
    "formularioVersaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioSecao" (
    "id" TEXT NOT NULL,
    "etapaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioSecao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioCampo" (
    "id" TEXT NOT NULL,
    "secaoId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rotulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "editavel" BOOLEAN NOT NULL DEFAULT true,
    "configuracao" JSONB,
    "valorPadrao" JSONB,
    "placeholder" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioCampo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoOpcao" (
    "id" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "rotulo" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampoOpcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoRegra" (
    "id" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "tipoRegra" TEXT NOT NULL,
    "valor" JSONB,
    "acao" TEXT NOT NULL,
    "mensagem" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 1,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampoRegra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoDependencia" (
    "id" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "campoOrigemId" TEXT NOT NULL,
    "operador" TEXT NOT NULL,
    "valor" JSONB,
    "acao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampoDependencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioPublicacao" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "formularioVersaoId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "limiteSubmissoes" INTEGER,
    "totalSubmissoes" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusGeral" NOT NULL DEFAULT 'PUBLICADO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioPublicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioLink" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "publicacaoId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "urlPublica" TEXT NOT NULL,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respondente" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "identificador" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Respondente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submissao" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "formularioVersaoId" TEXT NOT NULL,
    "publicacaoId" TEXT,
    "respondenteId" TEXT,
    "codigo" TEXT NOT NULL,
    "status" "StatusGeral" NOT NULL DEFAULT 'SUBMETIDA',
    "ip" TEXT,
    "userAgent" TEXT,
    "submetidoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissaoResposta" (
    "id" TEXT NOT NULL,
    "submissaoId" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "valorTexto" TEXT,
    "valorNumerico" BIGINT,
    "valorDecimal" DECIMAL(65,30),
    "valorData" TIMESTAMP(3),
    "valorBooleano" BOOLEAN,
    "valorJson" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissaoResposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioIzi_email_key" ON "UsuarioIzi"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilIzi_nome_key" ON "PerfilIzi"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PermissaoIzi_chave_key" ON "PermissaoIzi"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioPerfilIzi_usuarioIziId_perfilIziId_key" ON "UsuarioPerfilIzi"("usuarioIziId", "perfilIziId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilPermissaoIzi_perfilIziId_permissaoIziId_key" ON "PerfilPermissaoIzi"("perfilIziId", "permissaoIziId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioInstituicao_instituicaoId_email_key" ON "UsuarioInstituicao"("instituicaoId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilInstituicao_instituicaoId_nome_key" ON "PerfilInstituicao"("instituicaoId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "PermissaoInstituicao_chave_key" ON "PermissaoInstituicao"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioPerfilInstituicao_usuarioInstituicaoId_perfilInstitu_key" ON "UsuarioPerfilInstituicao"("usuarioInstituicaoId", "perfilInstituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilPermissaoInstituicao_perfilInstituicaoId_permissaoIns_key" ON "PerfilPermissaoInstituicao"("perfilInstituicaoId", "permissaoInstituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_instituicaoId_codigo_key" ON "Formulario"("instituicaoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioVersao_formularioId_numero_key" ON "FormularioVersao"("formularioId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioEtapa_formularioVersaoId_ordem_key" ON "FormularioEtapa"("formularioVersaoId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioSecao_etapaId_ordem_key" ON "FormularioSecao"("etapaId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioCampo_secaoId_codigo_key" ON "FormularioCampo"("secaoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioCampo_secaoId_ordem_key" ON "FormularioCampo"("secaoId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "CampoOpcao_campoId_valor_key" ON "CampoOpcao"("campoId", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "CampoOpcao_campoId_ordem_key" ON "CampoOpcao"("campoId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioLink_slug_key" ON "FormularioLink"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioLink_token_key" ON "FormularioLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Submissao_codigo_key" ON "Submissao"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissaoResposta_submissaoId_campoId_key" ON "SubmissaoResposta"("submissaoId", "campoId");

-- AddForeignKey
ALTER TABLE "UsuarioPerfilIzi" ADD CONSTRAINT "UsuarioPerfilIzi_usuarioIziId_fkey" FOREIGN KEY ("usuarioIziId") REFERENCES "UsuarioIzi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfilIzi" ADD CONSTRAINT "UsuarioPerfilIzi_perfilIziId_fkey" FOREIGN KEY ("perfilIziId") REFERENCES "PerfilIzi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissaoIzi" ADD CONSTRAINT "PerfilPermissaoIzi_perfilIziId_fkey" FOREIGN KEY ("perfilIziId") REFERENCES "PerfilIzi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissaoIzi" ADD CONSTRAINT "PerfilPermissaoIzi_permissaoIziId_fkey" FOREIGN KEY ("permissaoIziId") REFERENCES "PermissaoIzi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioInstituicao" ADD CONSTRAINT "UsuarioInstituicao_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilInstituicao" ADD CONSTRAINT "PerfilInstituicao_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfilInstituicao" ADD CONSTRAINT "UsuarioPerfilInstituicao_usuarioInstituicaoId_fkey" FOREIGN KEY ("usuarioInstituicaoId") REFERENCES "UsuarioInstituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfilInstituicao" ADD CONSTRAINT "UsuarioPerfilInstituicao_perfilInstituicaoId_fkey" FOREIGN KEY ("perfilInstituicaoId") REFERENCES "PerfilInstituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissaoInstituicao" ADD CONSTRAINT "PerfilPermissaoInstituicao_perfilInstituicaoId_fkey" FOREIGN KEY ("perfilInstituicaoId") REFERENCES "PerfilInstituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissaoInstituicao" ADD CONSTRAINT "PerfilPermissaoInstituicao_permissaoInstituicaoId_fkey" FOREIGN KEY ("permissaoInstituicaoId") REFERENCES "PermissaoInstituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formulario" ADD CONSTRAINT "Formulario_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formulario" ADD CONSTRAINT "Formulario_criadoPor_fkey" FOREIGN KEY ("criadoPor") REFERENCES "UsuarioInstituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioVersao" ADD CONSTRAINT "FormularioVersao_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioVersao" ADD CONSTRAINT "FormularioVersao_criadoPor_fkey" FOREIGN KEY ("criadoPor") REFERENCES "UsuarioInstituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioEtapa" ADD CONSTRAINT "FormularioEtapa_formularioVersaoId_fkey" FOREIGN KEY ("formularioVersaoId") REFERENCES "FormularioVersao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioSecao" ADD CONSTRAINT "FormularioSecao_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "FormularioEtapa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioCampo" ADD CONSTRAINT "FormularioCampo_secaoId_fkey" FOREIGN KEY ("secaoId") REFERENCES "FormularioSecao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoOpcao" ADD CONSTRAINT "CampoOpcao_campoId_fkey" FOREIGN KEY ("campoId") REFERENCES "FormularioCampo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoRegra" ADD CONSTRAINT "CampoRegra_campoId_fkey" FOREIGN KEY ("campoId") REFERENCES "FormularioCampo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoDependencia" ADD CONSTRAINT "CampoDependencia_campoId_fkey" FOREIGN KEY ("campoId") REFERENCES "FormularioCampo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoDependencia" ADD CONSTRAINT "CampoDependencia_campoOrigemId_fkey" FOREIGN KEY ("campoOrigemId") REFERENCES "FormularioCampo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioPublicacao" ADD CONSTRAINT "FormularioPublicacao_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioPublicacao" ADD CONSTRAINT "FormularioPublicacao_formularioVersaoId_fkey" FOREIGN KEY ("formularioVersaoId") REFERENCES "FormularioVersao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioLink" ADD CONSTRAINT "FormularioLink_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioLink" ADD CONSTRAINT "FormularioLink_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "FormularioPublicacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_formularioVersaoId_fkey" FOREIGN KEY ("formularioVersaoId") REFERENCES "FormularioVersao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "FormularioPublicacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_respondenteId_fkey" FOREIGN KEY ("respondenteId") REFERENCES "Respondente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissaoResposta" ADD CONSTRAINT "SubmissaoResposta_submissaoId_fkey" FOREIGN KEY ("submissaoId") REFERENCES "Submissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissaoResposta" ADD CONSTRAINT "SubmissaoResposta_campoId_fkey" FOREIGN KEY ("campoId") REFERENCES "FormularioCampo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
