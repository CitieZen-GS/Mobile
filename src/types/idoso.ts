import { Alimentacao } from './alimentacao';
import { Atividade } from './atividade';
import { LembreteConsulta } from './consulta';
import { Doenca } from './doenca';
import { Medicamento } from './medicamento';

/** IdosoResposta da API Java. Datas em aaaa-mm-dd. */
export interface Idoso {
  id: number;
  nome: string;
  cpf: string | null;
  altura: number | null;
  peso: number | null;
  dataNascimento: string;
  idade: number | null;
  comportamento: string | null;
  idCuidador: number;
}

/** IdosoRequisicao (POST /idosos e PUT /idosos/{id}). */
export interface IdosoRequisicao {
  nome: string;
  cpf?: string;
  altura?: number;
  peso?: number;
  dataNascimento: string;
  comportamento?: string;
  idCuidador: number;
}

/** ResumoIdosoResposta (GET /idosos/{id}/resumo?data=). */
export interface ResumoIdoso {
  idoso: Idoso;
  data: string;
  doencas: Doenca[];
  medicamentos: Medicamento[];
  atividadesDoDia: Atividade[];
  alimentacaoDoDia: Alimentacao[];
  proximasConsultas: LembreteConsulta[];
}
