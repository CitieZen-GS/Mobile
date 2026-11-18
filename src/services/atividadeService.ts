import { api } from './api';
import { Atividade, AtividadeRequisicao } from '@/types/atividade';

export const atividadeService = {
  /** GET /idosos/{idIdoso}/atividades?data= (filtro opcional por dia) */
  async listar(idIdoso: number, dataDoDia?: string): Promise<Atividade[]> {
    const { data } = await api.get<Atividade[]>(`/idosos/${idIdoso}/atividades`, {
      params: { data: dataDoDia },
    });
    return data;
  },

  /** GET /atividades/{id} */
  async buscar(id: number): Promise<Atividade> {
    const { data } = await api.get<Atividade>(`/atividades/${id}`);
    return data;
  },

  /** POST /idosos/{idIdoso}/atividades */
  async criar(idIdoso: number, dados: AtividadeRequisicao): Promise<Atividade> {
    const { data } = await api.post<Atividade>(`/idosos/${idIdoso}/atividades`, dados);
    return data;
  },

  /** PUT /atividades/{id} */
  async atualizar(id: number, dados: AtividadeRequisicao): Promise<Atividade> {
    const { data } = await api.put<Atividade>(`/atividades/${id}`, dados);
    return data;
  },

  /** DELETE /atividades/{id} */
  async remover(id: number): Promise<void> {
    await api.delete(`/atividades/${id}`);
  },
};
