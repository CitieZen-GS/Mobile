/** MedicamentoResposta da API Java. Hora em hh:mm. */
export interface Medicamento {
  id: number;
  nome: string;
  viaAdministracao: string | null;
  frequencia: string | null;
  instrucaoUso: string | null;
  data: string | null;
  hora: string;
  idIdoso: number;
}

/** MedicamentoRequisicao (POST /idosos/{idIdoso}/medicamentos e PUT /medicamentos/{id}). */
export interface MedicamentoRequisicao {
  nome: string;
  viaAdministracao?: string;
  frequencia?: string;
  instrucaoUso?: string;
  data?: string;
  hora: string;
}
