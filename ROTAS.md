# Rotas — Fase 1

## IZI
- POST /api/v1/izi/auth/login
- POST /api/v1/izi/utilizadores
- GET /api/v1/izi/utilizadores
- GET /api/v1/izi/instituicoes
- PATCH /api/v1/izi/instituicoes/:id/aprovar
- PATCH /api/v1/izi/instituicoes/:id/rejeitar
- PATCH /api/v1/izi/instituicoes/:id/suspender

## Instituição
- POST /api/v1/instituicoes/auth/register
- POST /api/v1/instituicoes/auth/login
- POST /api/v1/instituicoes/utilizadores
- GET /api/v1/instituicoes/utilizadores
- POST /api/v1/instituicoes/formularios
- GET /api/v1/instituicoes/formularios
- GET /api/v1/instituicoes/formularios/:id
- POST /api/v1/instituicoes/formularios/:id/versoes
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/etapas
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/etapas/:eid/secoes
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/secoes/:sid/campos
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/opcoes
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/regras
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/campos/:cid/dependencias
- POST /api/v1/instituicoes/formularios/:id/versoes/:vid/publicar
- GET /api/v1/instituicoes/formularios/:id/submissoes

## Público
- GET /api/v1/publico/formularios/:slug
- POST /api/v1/publico/formularios/:slug/submissoes
