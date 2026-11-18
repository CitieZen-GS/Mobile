import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { coresClaras, coresEscuras, CoresTema, ModoTema } from '@/styles/tema';

interface TemaContextType {
  modo: ModoTema;
  cores: CoresTema;
  escuro: boolean;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

/**
 * Segue automaticamente o tema do sistema (claro/escuro) do celular.
 */
export function TemaProvider({ children }: { children: ReactNode }) {
  const esquemaDoSistema = useColorScheme();
  const escuro = esquemaDoSistema === 'dark';

  const valor = useMemo<TemaContextType>(
    () => ({
      modo: escuro ? 'escuro' : 'claro',
      cores: escuro ? coresEscuras : coresClaras,
      escuro,
    }),
    [escuro],
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de um TemaProvider');
  }
  return contexto;
}
