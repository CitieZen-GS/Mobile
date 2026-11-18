import { apiAutenticacao } from './api';
import { armazenamento } from './armazenamento';
import {
  DadosCadastro,
  DadosLogin,
  PerfilUsuario,
  RespostaAutenticacao,
  Sessao,
  Usuario,
} from '@/types/autenticacao';

const CHAVE_SESSAO = 'ajudante_familiar_sessao';

interface ConteudoJwt {
  sub?: string;
  roles?: string[] | string;
  nome?: string;
  email?: string;
  idIdoso?: number;
  exp?: number;
}

/** Lê o payload do JWT (sem validar assinatura — quem valida é a API). */
function lerConteudoJwt(token: string): ConteudoJwt {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const preenchido = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(preenchido)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json) as ConteudoJwt;
  } catch {
    return {};
  }
}

function perfilDoToken(conteudo: ConteudoJwt): PerfilUsuario {
  const roles = Array.isArray(conteudo.roles) ? conteudo.roles : [conteudo.roles ?? ''];
  return roles.some((r) => r.replace('ROLE_', '') === 'CUIDADOR') ? 'CUIDADOR' : 'FAMILIAR';
}

/**
 * Monta o usuário logado. Usa o objeto "usuario" da resposta quando a API envia;
 * senão, extrai as informações das claims do próprio JWT (sub, roles, nome, idIdoso).
 */
function montarSessao(resposta: RespostaAutenticacao, emailInformado: string): Sessao {
  if (resposta.usuario) {
    return { token: resposta.token, usuario: resposta.usuario };
  }
  const conteudo = lerConteudoJwt(resposta.token);
  const usuario: Usuario = {
    id: Number(conteudo.sub),
    nome: conteudo.nome ?? emailInformado.split('@')[0],
    email: conteudo.email ?? emailInformado,
    perfil: perfilDoToken(conteudo),
    idIdoso: conteudo.idIdoso,
  };
  return { token: resposta.token, usuario };
}

/** true se o token já passou da data de expiração (claim exp). */
function tokenExpirado(token: string): boolean {
  const { exp } = lerConteudoJwt(token);
  return exp !== undefined && exp * 1000 <= Date.now();
}

export const autenticacaoService = {
  /** POST /auth/login */
  async entrar(dados: DadosLogin): Promise<Sessao> {
    const { data } = await apiAutenticacao.post<RespostaAutenticacao>('/auth/login', dados);
    const sessao = montarSessao(data, dados.email);
    await armazenamento.salvar(CHAVE_SESSAO, JSON.stringify(sessao));
    return sessao;
  },

  /** POST /auth/cadastro — já devolve o token, então o usuário entra direto. */
  async cadastrar(dados: DadosCadastro): Promise<Sessao> {
    const { data } = await apiAutenticacao.post<RespostaAutenticacao>('/auth/cadastro', dados);
    const sessao = montarSessao(data, dados.email);
    await armazenamento.salvar(CHAVE_SESSAO, JSON.stringify(sessao));
    return sessao;
  },

  /** Recupera a sessão salva no aparelho, descartando tokens expirados. */
  async carregarSessaoSalva(): Promise<Sessao | null> {
    const salvo = await armazenamento.ler(CHAVE_SESSAO);
    if (!salvo) return null;
    try {
      const sessao = JSON.parse(salvo) as Sessao;
      if (tokenExpirado(sessao.token)) {
        await armazenamento.remover(CHAVE_SESSAO);
        return null;
      }
      return sessao;
    } catch {
      await armazenamento.remover(CHAVE_SESSAO);
      return null;
    }
  },

  /** Logout: apaga o token do aparelho. */
  async sair(): Promise<void> {
    await armazenamento.remover(CHAVE_SESSAO);
  },
};
