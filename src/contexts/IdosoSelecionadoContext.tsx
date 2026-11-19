import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useAutenticacao } from './AutenticacaoContext';
import { useIdosos } from '@/hooks/useIdosos';
import { armazenamento } from '@/services/armazenamento';

const CHAVE_IDOSO_SELECIONADO = 'ajudante_familiar_idoso_selecionado';

interface IdosoSelecionadoContextType {
  /** Idoso cujas informações estão sendo exibidas nas abas. */
  idIdoso: number | undefined;
  selecionarIdoso: (id: number) => void;
  /** Ainda decidindo qual idoso mostrar (lista carregando). */
  definindo: boolean;
  /** Falha ao buscar a lista de idosos do cuidador (ex.: API fora do ar). */
  erroAoCarregar: unknown;
  tentarNovamente: () => void;
}

const IdosoSelecionadoContext = createContext<IdosoSelecionadoContextType | undefined>(undefined);

/**
 * - Familiar: acompanha sempre o idoso vinculado ao seu cadastro.
 * - Cuidador: escolhe entre os idosos que cuida; a escolha fica salva no aparelho.
 */
export function IdosoSelecionadoProvider({ children }: { children: ReactNode }) {
  const { usuario, ehCuidador } = useAutenticacao();
  const listaIdosos = useIdosos(usuario?.id, ehCuidador);
  const [idEscolhido, setIdEscolhido] = useState<number | undefined>();
  const [lidoDoAparelho, setLidoDoAparelho] = useState(false);

  useEffect(() => {
    armazenamento
      .ler(CHAVE_IDOSO_SELECIONADO)
      .then((salvo) => setIdEscolhido(salvo ? Number(salvo) : undefined))
      .finally(() => setLidoDoAparelho(true));
  }, []);

  const selecionarIdoso = useCallback((id: number) => {
    setIdEscolhido(id);
    armazenamento.salvar(CHAVE_IDOSO_SELECIONADO, String(id));
  }, []);

  let idIdoso: number | undefined;
  if (!ehCuidador) {
    idIdoso = usuario?.idIdoso ?? undefined;
  } else {
    const idosos = listaIdosos.data ?? [];
    // Mantém a escolha salva se o idoso ainda existe; senão, usa o primeiro da lista
    idIdoso = idosos.some((i) => i.id === idEscolhido) ? idEscolhido : idosos[0]?.id;
  }

  const definindo = ehCuidador && (!lidoDoAparelho || listaIdosos.isLoading);

  return (
    <IdosoSelecionadoContext.Provider
      value={{
        idIdoso,
        selecionarIdoso,
        definindo,
        erroAoCarregar: ehCuidador ? listaIdosos.error : null,
        tentarNovamente: () => void listaIdosos.refetch(),
      }}
    >
      {children}
    </IdosoSelecionadoContext.Provider>
  );
}

export function useIdosoSelecionado() {
  const contexto = useContext(IdosoSelecionadoContext);
  if (!contexto) {
    throw new Error('useIdosoSelecionado deve ser usado dentro de um IdosoSelecionadoProvider');
  }
  return contexto;
}
