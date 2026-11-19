import { apiAutenticacao } from './api';
import { armazenamento } from './armazenamento';
import { DadosCadastro, DadosLogin, RespostaToken, Sessao } from '@/types/autenticacao';

const CHAVE_SESSAO = 'ajudante_familiar_sessao';

/** Lê a data de expiração (claim exp) do JWT, sem validar assinatura — quem valida é a API. */
function expiracaoDoToken(token: string): number | undefined {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const preenchido = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    const { exp } = JSON.parse(atob(preenchido)) as { exp?: number };
    return exp;
  } catch {
    return undefined;
  }
}

function tokenExpirado(token: string): boolean {
  const exp = expiracaoDoToken(token);
  return exp !== undefined && exp * 1000 <= Date.now();
}

async function salvarSessao(resposta: RespostaToken): Promise<Sessao> {
  const sessao: Sessao = {
    tokenAcesso: resposta.tokenAcesso,
    tokenAtualizacao: resposta.tokenAtualizacao,
    usuario: resposta.usuario,
  };
  await armazenamento.salvar(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

export const autenticacaoService = {
  /** POST /autenticacao/login — cuidador recebe CUIDADOR; parente recebe FAMILIAR + idIdoso. */
  async entrar(dados: DadosLogin): Promise<Sessao> {
    const { data } = await apiAutenticacao.post<RespostaToken>('/autenticacao/login', dados);
    return salvarSessao(data);
  },

  /**
   * POST /autenticacao/cadastro — cria a conta e já devolve os tokens (o usuário entra direto).
   * Endpoint combinado com a equipe do backend; contrato no README.
   */
  async cadastrar(dados: DadosCadastro): Promise<Sessao> {
    const { data } = await apiAutenticacao.post<RespostaToken>('/autenticacao/cadastro', dados);
    return salvarSessao(data);
  },

  /** Recupera a sessão salva no aparelho, descartando tokens expirados. */
  async carregarSessaoSalva(): Promise<Sessao | null> {
    const salvo = await armazenamento.ler(CHAVE_SESSAO);
    if (!salvo) return null;
    try {
      const sessao = JSON.parse(salvo) as Sessao;
      if (!sessao.tokenAcesso || tokenExpirado(sessao.tokenAcesso)) {
        await armazenamento.remover(CHAVE_SESSAO);
        return null;
      }
      return sessao;
    } catch {
      await armazenamento.remover(CHAVE_SESSAO);
      return null;
    }
  },

  /**
   * Logout: revoga o token de atualização na API (POST /autenticacao/sair) e apaga a sessão do aparelho.
   * Se a API estiver fora do ar, a sessão local é apagada mesmo assim.
   */
  async sair(tokenAtualizacao?: string): Promise<void> {
    if (tokenAtualizacao) {
      await apiAutenticacao.post('/autenticacao/sair', { tokenAtualizacao }).catch(() => undefined);
    }
    await armazenamento.remover(CHAVE_SESSAO);
  },
};
