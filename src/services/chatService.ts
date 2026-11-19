import { apiRag } from './api';
import { MensagemChat, PerguntaRequisicao, RespostaChat } from '@/types/chat';

/** Quantas mensagens recentes o app mostra (a API aceita de 1 a 200). */
const LIMITE_HISTORICO = 100;

export const chatService = {
  /** GET /idosos/{idIdoso}/chat?limite= — histórico em ordem cronológica */
  async historico(idIdoso: number): Promise<MensagemChat[]> {
    const { data } = await apiRag.get<MensagemChat[]>(`/idosos/${idIdoso}/chat`, {
      params: { limite: LIMITE_HISTORICO },
    });
    return data;
  },

  /** POST /idosos/{idIdoso}/chat — a IA responde com os registros do idoso (leva alguns segundos) */
  async perguntar(idIdoso: number, dados: PerguntaRequisicao): Promise<RespostaChat> {
    const { data } = await apiRag.post<RespostaChat>(`/idosos/${idIdoso}/chat`, dados);
    return data;
  },

  /** DELETE /idosos/{idIdoso}/chat — apaga as mensagens (a memória da IA recomeça) */
  async limpar(idIdoso: number): Promise<void> {
    await apiRag.delete(`/idosos/${idIdoso}/chat`);
  },
};
