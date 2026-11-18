import { useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { definirToken, registrarAoSessaoExpirar } from '@/services/api';
import { autenticacaoService } from '@/services/autenticacaoService';
import { DadosCadastro, DadosLogin, Sessao, Usuario } from '@/types/autenticacao';

interface AutenticacaoContextType {
  usuario: Usuario | null;
  logado: boolean;
  /** true enquanto lê a sessão salva no aparelho (a splash fica visível). */
  carregandoSessao: boolean;
  ehCuidador: boolean;
  entrar: (dados: DadosLogin) => Promise<void>;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  sair: () => Promise<void>;
}

const AutenticacaoContext = createContext<AutenticacaoContextType | undefined>(undefined);

export function AutenticacaoProvider({ children }: { children: ReactNode }) {
  const clienteQuery = useQueryClient();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  const aplicarSessao = useCallback((nova: Sessao | null) => {
    definirToken(nova?.token ?? null);
    setSessao(nova);
  }, []);

  const sair = useCallback(async () => {
    await autenticacaoService.sair();
    aplicarSessao(null);
    // Limpa os dados em cache do usuário anterior
    clienteQuery.clear();
  }, [aplicarSessao, clienteQuery]);

  useEffect(() => {
    autenticacaoService
      .carregarSessaoSalva()
      .then(aplicarSessao)
      .finally(() => setCarregandoSessao(false));
  }, [aplicarSessao]);

  // Se a API responder 401 (token expirado/inválido), encerra a sessão e o guard volta ao login
  useEffect(() => {
    registrarAoSessaoExpirar(() => {
      sair();
    });
    return () => registrarAoSessaoExpirar(null);
  }, [sair]);

  const entrar = useCallback(
    async (dados: DadosLogin) => {
      aplicarSessao(await autenticacaoService.entrar(dados));
    },
    [aplicarSessao],
  );

  const cadastrar = useCallback(
    async (dados: DadosCadastro) => {
      aplicarSessao(await autenticacaoService.cadastrar(dados));
    },
    [aplicarSessao],
  );

  const usuario = sessao?.usuario ?? null;

  return (
    <AutenticacaoContext.Provider
      value={{
        usuario,
        logado: Boolean(sessao),
        carregandoSessao,
        ehCuidador: usuario?.perfil === 'CUIDADOR',
        entrar,
        cadastrar,
        sair,
      }}
    >
      {children}
    </AutenticacaoContext.Provider>
  );
}

export function useAutenticacao() {
  const contexto = useContext(AutenticacaoContext);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de um AutenticacaoProvider');
  }
  return contexto;
}
