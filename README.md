# Inscreve.AO — API Base Fase 1

Base funcional da primeira fase: IZI valida instituições; instituição cria conta, faz login e cria utilizadores; utilizadores autorizados criam formulários dinâmicos, versões, etapas, secções, campos, opções, regras e dependências; instituição publica; público consulta e submete; instituição consulta submissões.

## Tecnologias
NestJS 11, Prisma 6, PostgreSQL, JWT, bcrypt, class-validator.

## Instalação
1. `npm install`
2. Copie `.env.example` para `.env` e configure PostgreSQL.
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run prisma:seed`
6. `npm run start:dev`

## Admin IZI inicial
Email: `admin@izi.ao`
Senha: `Admin123`

## Rotas principais
### IZI
POST `/api/v1/izi/auth/login`
POST `/api/v1/izi/utilizadores`
GET `/api/v1/izi/utilizadores`
GET `/api/v1/izi/instituicoes`
PATCH `/api/v1/izi/instituicoes/:id/aprovar`
PATCH `/api/v1/izi/instituicoes/:id/rejeitar`
PATCH `/api/v1/izi/instituicoes/:id/suspender`

### Instituição
POST `/api/v1/instituicoes/auth/register`
POST `/api/v1/instituicoes/auth/login`
POST `/api/v1/instituicoes/utilizadores`
GET `/api/v1/instituicoes/utilizadores`
POST `/api/v1/instituicoes/formularios`
GET `/api/v1/instituicoes/formularios`
GET `/api/v1/instituicoes/formularios/:id`
POST `/api/v1/instituicoes/formularios/:id/versoes`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/etapas`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/etapas/:eid/secoes`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/secoes/:sid/campos`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/opcoes`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/regras`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/dependencias`
POST `/api/v1/instituicoes/formularios/:id/versoes/:vid/publicar`
GET `/api/v1/instituicoes/formularios/:id/submissoes`

### Público
GET `/api/v1/publico/formularios/:slug`
POST `/api/v1/publico/formularios/:slug/submissoes`

## Bruno
Abra a pasta `bruno/` como collection no Bruno e selecione o ambiente `local`.

O Portal do Candidato, pagamentos, documentos, avaliações, notificações e outros módulos foram deliberadamente deixados fora da Fase 1.
