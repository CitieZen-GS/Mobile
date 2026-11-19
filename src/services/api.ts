import { AxiosError, AxiosInstance, create, isAxiosError } from 'axios';
import { ErroRespostaApi } from '@/types/erro';

/**
 * Endereços das APIs (definidos no .env, veja .env.example).
 * - EXPO_PUBLIC_API_URL: API de funções (Java/Spring) — idosos, medicamentos, consultas, atividades.
 * - EXPO_PUBLIC_AUTH_URL: API de autenticação (Java/Spring), que emite o JWT.
 * - EXPO_PUBLIC_RAG_URL: API de RAG (Java/Spring + IA) — chat e relatórios do idoso.
 * Sem .env, usa as portas padrão das APIs no localhost do PC visto pelo emulador Android (10.0.2.2).
 */
export const URL_API = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';
export const URL_AUTENTICACAO = process.env.EXPO_PUBLIC_AUTH_URL ?? 'http://10.0.2.2:8081';
export const URL_RAG = process.env.EXPO_PUBLIC_RAG_URL ?? 'http://10.0.2.2:8082';

const TEMPO_LIMITE_MS = 15000;
/** A resposta do chat passa pela IA e pode levar alguns segundos a mais. */
const TEMPO_LIMITE_IA_MS = 60000;

let tokenAtual: string | null = null;
let aoSessaoExpirar: (() => void) | null = null;

/** Guarda o JWT em memória para as próximas requisições. */
export function definirToken(token: string | null) {
  tokenAtual = token;
}

/** Callback chamado quando a API responde 401 (token ausente, inválido ou expirado). */
export function registrarAoSessaoExpirar(callback: (() => void) | null) {
  aoSessaoExpirar = callback;
}

function criarCliente(baseURL: string, tempoLimite = TEMPO_LIMITE_MS): AxiosInstance {
  const cliente = create({
    baseURL,
    timeout: tempoLimite,
    headers: { 'Content-Type': 'application/json' },
  });

  cliente.interceptors.request.use((config) => {
    if (tokenAtual) {
      config.headers.Authorization = `Bearer ${tokenAtual}`;
    }
    return config;
  });

  cliente.interceptors.response.use(
    (resposta) => resposta,
    (erro: AxiosError) => {
      const rotaDeAutenticacao = erro.config?.url?.startsWith('/autenticacao');
      if (erro.response?.status === 401 && !rotaDeAutenticacao && aoSessaoExpirar) {
        aoSessaoExpirar();
      }
      return Promise.reject(erro);
    },
  );

  return cliente;
}

/** Cliente da API de funções (Java). */
export const api = criarCliente(URL_API);

/** Cliente da API de autenticação. */
export const apiAutenticacao = criarCliente(URL_AUTENTICACAO);

/** Cliente da API de RAG (chat e relatórios com IA). Só atende o cuidador. */
export const apiRag = criarCliente(URL_RAG, TEMPO_LIMITE_IA_MS);

/**
 * Converte qualquer erro de requisição em uma mensagem clara para o usuário.
 * Usa a ErroResposta padronizada da API quando ela existe.
 */
export function extrairMensagemErro(erro: unknown): string {
  if (!isAxiosError(erro)) {
    return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.';
  }

  if (erro.code === 'ECONNABORTED') {
    return 'O servidor demorou para responder. Verifique sua internet e tente novamente.';
  }

  if (!erro.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua internet.';
  }

  const { status, data } = erro.response as { status: number; data?: Partial<ErroRespostaApi> };

  if (data?.campos && data.campos.length > 0) {
    const detalhes = data.campos.map((c) => `• ${c.campo}: ${c.mensagem}`).join('\n');
    return `${data.mensagem ?? 'Dados inválidos'}\n${detalhes}`;
  }

  switch (status) {
    case 401:
      return data?.mensagem ?? 'Sua sessão expirou. Entre novamente.';
    case 403:
      return 'Seu perfil não tem permissão para esta ação.';
    case 404:
      return data?.mensagem ?? 'Registro não encontrado.';
    case 409:
      return data?.mensagem ?? 'Este registro já existe ou está em uso.';
    case 429:
      return 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.';
    case 503:
      // API de RAG: a IA não respondeu (nada foi gravado)
      return (
        data?.mensagem ?? 'O serviço está indisponível no momento. Tente novamente em instantes.'
      );
    default:
      if (status >= 500) {
        return 'O servidor está com problemas no momento. Tente novamente em instantes.';
      }
      return data?.mensagem ?? `Erro ${status} ao processar a solicitação.`;
  }
}
