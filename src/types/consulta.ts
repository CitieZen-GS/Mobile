import { Medicamento } from './medicamento';

export type StatusConsulta = 'PENDENTE' | 'REALIZADO';

/** LembreteConsultaResposta da API Java. */
export interface LembreteConsulta {
  id: number;
  titulo: string;
  nomeMedico: string | null;
  dataConsulta: string;
  horaConsulta: string | null;
  descricao: string | null;
  status: StatusConsulta;
  idIdoso: number;
  medicamentos: Medicamento[];
}

/** LembreteConsultaRequisicao (POST /idosos/{idIdoso}/lembretes-consulta e PUT /lembretes-consulta/{id}). */
export interface LembreteConsultaRequisicao {
  titulo: string;
  nomeMedico?: string;
  dataConsulta: string;
  horaConsulta?: string;
  descricao?: string;
}
