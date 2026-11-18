import { api } from './api';
import { LembreteConsulta, LembreteConsultaRequisicao, StatusConsulta } from '@/types/consulta';

export const consultaService = {
  /** GET /idosos/{idIdoso}/lembretes-consulta?status= */
  async listar(idIdoso: number, status?: StatusConsulta): Promise<LembreteConsulta[]> {
    const { data } = await api.get<LembreteConsulta[]>(`/idosos/${idIdoso}/lembretes-consulta`, {
      params: { status },
    });
    return data;
  },

  /** GET /lembretes-consulta/{id} */
  async buscar(id: number): Promise<LembreteConsulta> {
    const { data } = await api.get<LembreteConsulta>(`/lembretes-consulta/${id}`);
    return data;
  },

  /** POST /idosos/{idIdoso}/lembretes-consulta (nasce com status PENDENTE) */
  async criar(idIdoso: number, dados: LembreteConsultaRequisicao): Promise<LembreteConsulta> {
    const { data } = await api.post<LembreteConsulta>(
      `/idosos/${idIdoso}/lembretes-consulta`,
      dados,
    );
    return data;
  },

  /** PUT /lembretes-consulta/{id} */
  async atualizar(id: number, dados: LembreteConsultaRequisicao): Promise<LembreteConsulta> {
    const { data } = await api.put<LembreteConsulta>(`/lembretes-consulta/${id}`, dados);
    return data;
  },

  /** PATCH /lembretes-consulta/{id}/status */
  async alterarStatus(id: number, status: StatusConsulta): Promise<LembreteConsulta> {
    const { data } = await api.patch<LembreteConsulta>(`/lembretes-consulta/${id}/status`, {
      status,
    });
    return data;
  },

  /** DELETE /lembretes-consulta/{id} */
  async remover(id: number): Promise<void> {
    await api.delete(`/lembretes-consulta/${id}`);
  },

  /** POST /lembretes-consulta/{id}/medicamentos/{idMedicamento} */
  async vincularMedicamento(id: number, idMedicamento: number): Promise<LembreteConsulta> {
    const { data } = await api.post<LembreteConsulta>(
      `/lembretes-consulta/${id}/medicamentos/${idMedicamento}`,
    );
    return data;
  },

  /** DELETE /lembretes-consulta/{id}/medicamentos/{idMedicamento} */
  async desvincularMedicamento(id: number, idMedicamento: number): Promise<LembreteConsulta> {
    const { data } = await api.delete<LembreteConsulta>(
      `/lembretes-consulta/${id}/medicamentos/${idMedicamento}`,
    );
    return data;
  },
};
