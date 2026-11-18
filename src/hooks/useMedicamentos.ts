import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chavesIdoso } from './useIdosos';
import { medicamentoService } from '@/services/medicamentoService';
import { MedicamentoRequisicao } from '@/types/medicamento';

export const chavesMedicamento = {
  todos: ['medicamentos'] as const,
  lista: (idIdoso?: number) => ['medicamentos', 'lista', idIdoso] as const,
  detalhe: (id?: number) => ['medicamentos', 'detalhe', id] as const,
};

export function useMedicamentos(idIdoso?: number) {
  return useQuery({
    queryKey: chavesMedicamento.lista(idIdoso),
    queryFn: () => medicamentoService.listar(idIdoso as number),
    enabled: idIdoso !== undefined,
  });
}

export function useMedicamento(id?: number) {
  return useQuery({
    queryKey: chavesMedicamento.detalhe(id),
    queryFn: () => medicamentoService.buscar(id as number),
    enabled: id !== undefined,
  });
}

/** Após qualquer alteração, atualiza a lista e o resumo do dia na tela inicial. */
function useInvalidarMedicamentos() {
  const clienteQuery = useQueryClient();
  return () => {
    clienteQuery.invalidateQueries({ queryKey: chavesMedicamento.todos });
    clienteQuery.invalidateQueries({ queryKey: chavesIdoso.todos });
  };
}

export function useSalvarMedicamento() {
  const invalidar = useInvalidarMedicamentos();
  return useMutation({
    mutationFn: ({
      id,
      idIdoso,
      dados,
    }: {
      id?: number;
      idIdoso: number;
      dados: MedicamentoRequisicao;
    }) => (id ? medicamentoService.atualizar(id, dados) : medicamentoService.criar(idIdoso, dados)),
    onSuccess: invalidar,
  });
}

export function useRemoverMedicamento() {
  const invalidar = useInvalidarMedicamentos();
  return useMutation({
    mutationFn: (id: number) => medicamentoService.remover(id),
    onSuccess: invalidar,
  });
}
