import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const p = new PrismaClient();

async function main() {
  // ===== 1. Admin IZI =====
  const senhaAdmin = await bcrypt.hash('Admin123', 10);
  const admin = await p.usuarioIzi.upsert({
    where: { email: 'admin@izi.ao' },
    update: {},
    create: {
      nome: 'Administrador',
      apelido: 'IZI',
      email: 'admin@izi.ao',
      senha: senhaAdmin,
      cargo: 'Administrador da Plataforma',
      status: 'ATIVO',
    },
  });

  const perfilIzi = await p.perfilIzi.upsert({
    where: { nome: 'Administrador' },
    update: {},
    create: { nome: 'Administrador', descricao: 'Acesso administrativo da IZI' },
  });

  await p.usuarioPerfilIzi.upsert({
    where: { usuarioIziId_perfilIziId: { usuarioIziId: admin.id, perfilIziId: perfilIzi.id } },
    update: {},
    create: { usuarioIziId: admin.id, perfilIziId: perfilIzi.id },
  });

  const perms: [string, string, string][] = [
    ['Instituições', 'instituicoes.aprovar', 'instituicoes'],
    ['Instituições', 'instituicoes.listar', 'instituicoes'],
    ['Utilizadores', 'utilizadores.gerir', 'utilizadores'],
  ];

  for (const [nome, chave, modulo] of perms) {
    const perm = await p.permissaoIzi.upsert({
      where: { chave },
      update: {},
      create: { nome, chave, modulo },
    });
    await p.perfilPermissaoIzi.upsert({
      where: { perfilIziId_permissaoIziId: { perfilIziId: perfilIzi.id, permissaoIziId: perm.id } },
      update: {},
      create: { perfilIziId: perfilIzi.id, permissaoIziId: perm.id },
    });
  }

  // ===== 2. Instituição já ATIVA (pronta a usar, sem passar por aprovação) =====
  const senhaResp = await bcrypt.hash('Senha@123', 10);

  let instituicao = await p.instituicao.findFirst({
    where: { email: 'geral@seguroao.ao' },
  });

  if (!instituicao) {
    instituicao = await p.instituicao.create({
      data: {
        nome: 'Seguradora Exemplo',
        nomeComercial: 'Seguro AO',
        sigla: 'SAO',
        tipo: 'SEGURADORA',
        nif: '5001234567',
        email: 'geral@seguroao.ao',
        telefone: '923000000',
        provincia: 'Luanda',
        municipio: 'Luanda',
        endereco: 'Luanda',
        status: 'ATIVO',
      },
    });
  } else if (instituicao.status !== 'ATIVO') {
    instituicao = await p.instituicao.update({
      where: { id: instituicao.id },
      data: { status: 'ATIVO' },
    });
  }

  const responsavel = await p.usuarioInstituicao.upsert({
    where: { instituicaoId_email: { instituicaoId: instituicao.id, email: 'joao@seguroao.ao' } },
    update: { status: 'ATIVO' },
    create: {
      instituicaoId: instituicao.id,
      nome: 'Joao',
      apelido: 'Manuel',
      email: 'joao@seguroao.ao',
      telefone: '923111222',
      senha: senhaResp,
      cargo: 'Administrador',
      status: 'ATIVO',
    },
  });

  const perfilInst = await p.perfilInstituicao.upsert({
    where: { instituicaoId_nome: { instituicaoId: instituicao.id, nome: 'Administrador' } },
    update: {},
    create: {
      instituicaoId: instituicao.id,
      nome: 'Administrador',
      descricao: 'Administrador da instituição',
    },
  });

  await p.usuarioPerfilInstituicao.upsert({
    where: {
      usuarioInstituicaoId_perfilInstituicaoId: {
        usuarioInstituicaoId: responsavel.id,
        perfilInstituicaoId: perfilInst.id,
      },
    },
    update: {},
    create: { usuarioInstituicaoId: responsavel.id, perfilInstituicaoId: perfilInst.id },
  });

  // ===== 3. Formulário completo, com versão, etapa, secção, campos, e JÁ PUBLICADO =====
  const formulario = await p.formulario.upsert({
    where: { instituicaoId_codigo: { instituicaoId: instituicao.id, codigo: 'SEGURO_AUTO_2026' } },
    update: {},
    create: {
      instituicaoId: instituicao.id,
      criadoPor: responsavel.id,
      nome: 'Simulação de Seguro Automóvel',
      codigo: 'SEGURO_AUTO_2026',
      descricao: 'Formulário dinâmico de simulação',
      finalidade: 'Recolher dados para cálculo de seguro',
      tipoAcesso: 'PUBLICO',
      status: 'RASCUNHO',
    },
  });

  let versao = await p.formularioVersao.findFirst({
    where: { formularioId: formulario.id, numero: 1 },
  });

  if (!versao) {
    versao = await p.formularioVersao.create({
      data: {
        formularioId: formulario.id,
        numero: 1,
        nome: 'Versão inicial',
        descricao: 'Versão 1 do formulário',
        criadoPor: responsavel.id,
        status: 'RASCUNHO',
      },
    });
  }

  let etapa = await p.formularioEtapa.findFirst({
    where: { formularioVersaoId: versao.id, ordem: 1 },
  });

  if (!etapa) {
    etapa = await p.formularioEtapa.create({
      data: {
        formularioVersaoId: versao.id,
        nome: 'Dados do veículo',
        descricao: 'Dados necessários para a simulação',
        ordem: 1,
        obrigatoria: true,
      },
    });
  }

  let secao = await p.formularioSecao.findFirst({
    where: { etapaId: etapa.id, ordem: 1 },
  });

  if (!secao) {
    secao = await p.formularioSecao.create({
      data: {
        etapaId: etapa.id,
        nome: 'Veículo',
        descricao: 'Informações do veículo',
        ordem: 1,
      },
    });
  }

  let campoMarca = await p.formularioCampo.findFirst({
    where: { secaoId: secao.id, codigo: 'marca' },
  });

  if (!campoMarca) {
    campoMarca = await p.formularioCampo.create({
      data: {
        secaoId: secao.id,
        codigo: 'marca',
        nome: 'Marca',
        rotulo: 'Marca do veículo',
        tipo: 'select',
        ordem: 1,
        obrigatorio: true,
        configuracao: { pesquisavel: true },
      },
    });

    await p.campoOpcao.createMany({
      data: [
        { campoId: campoMarca.id, valor: 'toyota', rotulo: 'Toyota', ordem: 1 },
        { campoId: campoMarca.id, valor: 'hyundai', rotulo: 'Hyundai', ordem: 2 },
        { campoId: campoMarca.id, valor: 'mercedes', rotulo: 'Mercedes-Benz', ordem: 3 },
      ],
    });
  }

  let campoValor = await p.formularioCampo.findFirst({
    where: { secaoId: secao.id, codigo: 'valor_veiculo' },
  });

  if (!campoValor) {
    campoValor = await p.formularioCampo.create({
      data: {
        secaoId: secao.id,
        codigo: 'valor_veiculo',
        nome: 'Valor',
        rotulo: 'Valor do veículo',
        tipo: 'moeda',
        ordem: 2,
        obrigatorio: true,
        configuracao: { moeda: 'AOA', minimo: 0, casasDecimais: 2 },
      },
    });

    await p.campoRegra.create({
      data: {
        campoId: campoValor.id,
        tipoRegra: 'MIN',
        valor: 100000,
        acao: 'BLOQUEAR',
        mensagem: 'O valor mínimo do veículo é 100.000 AOA',
        ordem: 1,
      },
    });
  }

  // Publicar (se ainda não houver publicação/link ativos)
  let link = await p.formularioLink.findFirst({
    where: { formularioId: formulario.id, status: 'ATIVO' },
  });

  if (!link) {
    const pub = await p.formularioPublicacao.create({
      data: {
        formularioId: formulario.id,
        formularioVersaoId: versao.id,
        dataInicio: new Date(),
        limiteSubmissoes: 1000,
        status: 'PUBLICADO',
      },
    });

    link = await p.formularioLink.create({
      data: {
        formularioId: formulario.id,
        publicacaoId: pub.id,
        slug: 'seguro-auto-2026-simulacao',
        token: crypto.randomUUID(),
        urlPublica: `http://localhost:3000/api/v1/publico/formularios/seguro-auto-2026-simulacao`,
        dataInicio: pub.dataInicio,
      },
    });

    await p.formularioVersao.update({
      where: { id: versao.id },
      data: { status: 'PUBLICADO', publicadoEm: new Date() },
    });

    await p.formulario.update({
      where: { id: formulario.id },
      data: { status: 'PUBLICADO', versaoAtualId: versao.id, publicadoEm: new Date() },
    });
  }

  console.log('\n===== Seed concluído =====');
  console.log('IZI       -> email: admin@izi.ao        | senha: Admin123');
  console.log('Instituição (ATIVA) -> email: joao@seguroao.ao | senha: Senha@123');
  console.log(`Formulário publicado -> slug: ${link.slug}`);
  console.log(`Campo "marca" id: ${campoMarca.id}`);
  console.log(`Campo "valor_veiculo" id: ${campoValor.id}`);
  console.log('===========================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
