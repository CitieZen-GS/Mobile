/** AtividadeResposta da API Java. */
export interface Atividade {
  id: number;
  nome: string;
  descricao: string | null;
  data: string;
  horaInicio: string | null;
  horaFim: string | null;
  idIdoso: number;
}

/** AtividadeRequisicao (POST /idosos/{idIdoso}/atividades e PUT /atividades/{id}). */
export interface AtividadeRequisicao {
  nome: string;
  descricao?: string;
  data: string;
  horaInicio?: string;
  horaFim?: string;
}
