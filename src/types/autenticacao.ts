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

/** Cadastro de cuidador ou familiar (POST /autenticacao/cadastro). */
export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
  /** Cuidador */
  cpf?: string;
  /** Familiar */
  telefone?: string;
  /** Familiar: código do idoso que ele acompanha (informado pelo cuidador). */
  idIdoso?: number;
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
