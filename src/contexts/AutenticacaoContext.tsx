import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { definirToken, registrarAoSessaoExpirar } from '@/services/api';
import { autenticacaoService } from '@/services/autenticacaoService';
import { DadosCadastroCuidador, DadosLogin, Sessao, Usuario } from '@/types/autenticacao';

interface AutenticacaoContextType {
  usuario: Usuario | null;
  logado: boolean;
  /** true enquanto lê a sessão salva no aparelho (a splash fica visível). */
  carregandoSessao: boolean;
  ehCuidador: boolean;
  entrar: (dados: DadosLogin) => Promise<void>;
  cadastrar: (dados: DadosCadastroCuidador) => Promise<void>;
  sair: () => Promise<void>;
}

const AutenticacaoContext = createContext<AutenticacaoContextType | undefined>(undefined);

export function AutenticacaoProvider({ children }: { children: ReactNode }) {
  const clienteQuery = useQueryClient();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  // Referência sempre atualizada da sessão, usada no logout (revogar o token de atualização)
  const sessaoRef = useRef<Sessao | null>(null);

  const aplicarSessao = useCallback((nova: Sessao | null) => {
    definirToken(nova?.tokenAcesso ?? null);
    sessaoRef.current = nova;
    setSessao(nova);
  }, []);

  const sair = useCallback(async () => {
    await autenticacaoService.sair(sessaoRef.current?.tokenAtualizacao);
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
    async (dados: DadosCadastroCuidador) => {
      aplicarSessao(await autenticacaoService.cadastrarCuidador(dados));
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
        ehCuidador: usuario?.tipo === 'CUIDADOR',
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
