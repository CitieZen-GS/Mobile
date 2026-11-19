/** AutorMensagem da API de RAG: quem escreveu a mensagem do chat. */
export type AutorMensagem = 'CUIDADOR' | 'ASSISTENTE';

/** MensagemResposta da API de RAG. */
export interface MensagemChat {
  id: number;
  autor: AutorMensagem;
  /** Respostas do assistente vêm em Markdown (listas, negrito). */
  conteudo: string;
  /** Data e hora no horário de Brasília (aaaa-mm-ddThh:mm:ss). */
  dataEnvio: string;
}

/**
 * De onde veio o período consultado:
 * INFORMADO (datas do app), IDENTIFICADO_PELA_IA ("ontem", "semana passada"...) ou PADRAO (últimos 7 dias).
 */
export type OrigemPeriodo = 'INFORMADO' | 'IDENTIFICADO_PELA_IA' | 'PADRAO';

/** PeriodoResposta: período cujos registros a IA usou na resposta. */
export interface PeriodoConsultado {
  inicio: string;
  fim: string;
  origem: OrigemPeriodo;
}

/** PerguntaRequisicao (POST /idosos/{idIdoso}/chat). */
export interface PerguntaRequisicao {
  pergunta: string;
  /** Opcional, sempre junto com dataFim. Sem as duas, a IA identifica o período na pergunta. */
  dataInicio?: string;
  dataFim?: string;
}

/** RespostaChat (POST /idosos/{idIdoso}/chat): pergunta e resposta já gravadas no histórico. */
export interface RespostaChat {
  pergunta: MensagemChat;
  resposta: MensagemChat;
  periodoConsultado: PeriodoConsultado;
}
