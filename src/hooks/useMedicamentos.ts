import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ehDoRegistroExcluido, recarregarCache } from './cache';
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

/**
 * Após qualquer alteração, recarrega a lista, o resumo do dia e as consultas
 * (que mostram os medicamentos a levar).
 */
function useInvalidarMedicamentos() {
  const clienteQuery = useQueryClient();
  return (ignorar?: (chave: QueryKey) => boolean) =>
    recarregarCache(clienteQuery, ['medicamentos', 'idosos', 'consultas'], ignorar);
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
    onSuccess: () => invalidar(),
  });
}

export function useRemoverMedicamento() {
  const invalidar = useInvalidarMedicamentos();
  return useMutation({
    mutationFn: (id: number) => medicamentoService.remover(id),
    onSuccess: (_resposta, id) => invalidar(ehDoRegistroExcluido(id)),
  });
}
