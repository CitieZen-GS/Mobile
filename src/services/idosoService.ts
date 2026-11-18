import { api } from './api';
import { Idoso, IdosoRequisicao, ResumoIdoso } from '@/types/idoso';

export const idosoService = {
  /** GET /idosos?idCuidador= */
  async listar(idCuidador?: number): Promise<Idoso[]> {
    const { data } = await api.get<Idoso[]>('/idosos', { params: { idCuidador } });
    return data;
  },

  /** GET /idosos/{id} */
  async buscar(id: number): Promise<Idoso> {
    const { data } = await api.get<Idoso>(`/idosos/${id}`);
    return data;
  },

  /** GET /idosos/{id}/resumo?data= — visão do dia para a tela inicial. */
  async resumo(id: number, dataDoDia: string): Promise<ResumoIdoso> {
    const { data } = await api.get<ResumoIdoso>(`/idosos/${id}/resumo`, {
      params: { data: dataDoDia },
    });
    return data;
  },

  /** POST /idosos */
  async criar(dados: IdosoRequisicao): Promise<Idoso> {
    const { data } = await api.post<Idoso>('/idosos', dados);
    return data;
  },

  /** PUT /idosos/{id} */
  async atualizar(id: number, dados: IdosoRequisicao): Promise<Idoso> {
    const { data } = await api.put<Idoso>(`/idosos/${id}`, dados);
    return data;
  },

  /** DELETE /idosos/{id} */
  async remover(id: number): Promise<void> {
    await api.delete(`/idosos/${id}`);
  },
};
