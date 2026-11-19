/** TipoUsuario da API de autenticação (vira a claim "roles" do JWT). */
export type TipoUsuario = 'CUIDADOR' | 'FAMILIAR';

/** UsuarioResposta da API de autenticação. */
export interface Usuario {
  /** id_cuidador ou id_parente, conforme o tipo. */
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  /** CUIDADOR: ["LEITURA", "ESCRITA"] · FAMILIAR: ["LEITURA"] */
  permissoes: string[];
  /** Só para FAMILIAR: o idoso que o parente acompanha. */
  idIdoso: number | null;
}

/** LoginRequisicao (POST /autenticacao/login). */
export interface DadosLogin {
  email: string;
  senha: string;
}

/**
 * CadastroCuidadorRequisicao (POST /autenticacao/cadastro/cuidador, rota pública).
 * O cuidador é o dono da conta: depois cadastra os idosos e os familiares.
 */
export interface DadosCadastroCuidador {
  nome: string;
  /** Opcional: 000.000.000-00 */
  cpf?: string;
  email: string;
  /** De 6 a 72 caracteres. */
  senha: string;
}

/**
 * CadastroParenteRequisicao (POST /autenticacao/cadastro/parente, só cuidador logado).
 * O familiar depois entra pelo login com este e-mail e senha.
 */
export interface DadosCadastroFamiliar {
  nome: string;
  /** Opcional */
  telefone?: string;
  email: string;
  senha: string;
  /** Idoso do cuidador logado que o familiar vai acompanhar. */
  idIdoso: number;
}

/** TokenResposta (login, cadastro e /autenticacao/atualizar). */
export interface RespostaToken {
  /** JWT enviado no header Authorization: Bearer */
  tokenAcesso: string;
  tipoToken: string;
  /** Validade do token de acesso, em segundos. */
  expiraEm: number;
  /** Usado em /autenticacao/atualizar e /autenticacao/sair. */
  tokenAtualizacao: string;
  usuario: Usuario;
}

/** O que fica salvo no aparelho. */
export interface Sessao {
  tokenAcesso: string;
  tokenAtualizacao: string;
  usuario: Usuario;
}
