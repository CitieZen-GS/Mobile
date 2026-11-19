import { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Recarrega o cache dos recursos informados (ex.: ['medicamentos', 'idosos']) e só resolve
 * quando os dados novos chegam. Usado no onSuccess das mutações: assim, ao voltar
 * para a lista, ela já aparece atualizada (sem mostrar por um instante o item antigo).
 */
export function recarregarCache(
  cliente: QueryClient,
  recursos: string[],
  ignorar?: (chave: QueryKey) => boolean,
) {
  return Promise.all(
    recursos.map((recurso) =>
      cliente.invalidateQueries({
        queryKey: [recurso],
        predicate: (consulta) => !ignorar?.(consulta.queryKey),
      }),
    ),
  );
}

/**
 * Depois de excluir, não tenta recarregar o próprio registro apagado
 * (a API responderia 404 enquanto a tela de edição ainda está aberta).
 */
export function ehDoRegistroExcluido(id: number) {
  return (chave: QueryKey) => chave[2] === id && (chave[1] === 'detalhe' || chave[1] === 'resumo');
}
