import { api } from './api';
import { Medicamento, MedicamentoRequisicao } from '@/types/medicamento';

export const medicamentoService = {
  /** GET /idosos/{idIdoso}/medicamentos */
  async listar(idIdoso: number): Promise<Medicamento[]> {
    const { data } = await api.get<Medicamento[]>(`/idosos/${idIdoso}/medicamentos`);
    return data;
  },

  /** GET /medicamentos/{id} */
  async buscar(id: number): Promise<Medicamento> {
    const { data } = await api.get<Medicamento>(`/medicamentos/${id}`);
    return data;
  },

  /** POST /idosos/{idIdoso}/medicamentos */
  async criar(idIdoso: number, dados: MedicamentoRequisicao): Promise<Medicamento> {
    const { data } = await api.post<Medicamento>(`/idosos/${idIdoso}/medicamentos`, dados);
    return data;
  },

  /** PUT /medicamentos/{id} */
  async atualizar(id: number, dados: MedicamentoRequisicao): Promise<Medicamento> {
    const { data } = await api.put<Medicamento>(`/medicamentos/${id}`, dados);
    return data;
  },

  /** DELETE /medicamentos/{id} */
  async remover(id: number): Promise<void> {
    await api.delete(`/medicamentos/${id}`);
  },
};
