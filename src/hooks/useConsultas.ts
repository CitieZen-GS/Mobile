import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chavesIdoso } from './useIdosos';
import { consultaService } from '@/services/consultaService';
import { LembreteConsultaRequisicao, StatusConsulta } from '@/types/consulta';

export const chavesConsulta = {
  todos: ['consultas'] as const,
  lista: (idIdoso?: number, status?: StatusConsulta) =>
    ['consultas', 'lista', idIdoso, status] as const,
  detalhe: (id?: number) => ['consultas', 'detalhe', id] as const,
};

export function useConsultas(idIdoso?: number, status?: StatusConsulta) {
  return useQuery({
    queryKey: chavesConsulta.lista(idIdoso, status),
    queryFn: () => consultaService.listar(idIdoso as number, status),
    enabled: idIdoso !== undefined,
  });
}

export function useConsulta(id?: number) {
  return useQuery({
    queryKey: chavesConsulta.detalhe(id),
    queryFn: () => consultaService.buscar(id as number),
    enabled: id !== undefined,
  });
}

/** Após qualquer alteração, atualiza as listas e o resumo do dia. */
function useInvalidarConsultas() {
  const clienteQuery = useQueryClient();
  return () => {
    clienteQuery.invalidateQueries({ queryKey: chavesConsulta.todos });
    clienteQuery.invalidateQueries({ queryKey: chavesIdoso.todos });
  };
}

export function useSalvarConsulta() {
  const invalidar = useInvalidarConsultas();
  return useMutation({
    mutationFn: ({
      id,
      idIdoso,
      dados,
    }: {
      id?: number;
      idIdoso: number;
      dados: LembreteConsultaRequisicao;
    }) => (id ? consultaService.atualizar(id, dados) : consultaService.criar(idIdoso, dados)),
    onSuccess: invalidar,
  });
}

export function useAlterarStatusConsulta() {
  const invalidar = useInvalidarConsultas();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusConsulta }) =>
      consultaService.alterarStatus(id, status),
    onSuccess: invalidar,
  });
}

export function useRemoverConsulta() {
  const invalidar = useInvalidarConsultas();
  return useMutation({
    mutationFn: (id: number) => consultaService.remover(id),
    onSuccess: invalidar,
  });
}

/** Liga/desliga um medicamento da lista "levar para a consulta". */
export function useAlternarMedicamentoConsulta() {
  const invalidar = useInvalidarConsultas();
  return useMutation({
    mutationFn: ({
      id,
      idMedicamento,
      vincular,
    }: {
      id: number;
      idMedicamento: number;
      vincular: boolean;
    }) =>
      vincular
        ? consultaService.vincularMedicamento(id, idMedicamento)
        : consultaService.desvincularMedicamento(id, idMedicamento),
    onSuccess: invalidar,
  });
}
