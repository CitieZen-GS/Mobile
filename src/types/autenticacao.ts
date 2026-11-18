/** Perfis de acesso emitidos pela API de autenticação na claim "roles" do JWT. */
export type PerfilUsuario = 'CUIDADOR' | 'FAMILIAR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  /** Familiar acompanha um idoso específico (FK id_idoso em T_Ajudante_familiar_Parente). */
  idIdoso?: number;
}

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  /** Cuidador */
  cpf?: string;
  /** Familiar */
  telefone?: string;
  /** Familiar: código do idoso que ele acompanha (informado pelo cuidador). */
  idIdoso?: number;
}

/** Resposta de POST /auth/login e POST /auth/cadastro. */
export interface RespostaAutenticacao {
  token: string;
  usuario?: Usuario;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}
