/**
 * Identidade visual do Ajudante Familiar.
 *
 * Paleta pensada para quem cuida de idosos: tons calmos (verde-água e creme),
 * alto contraste no texto e um tom terracota para chamar atenção sem assustar.
 * Os tamanhos de fonte e de toque são maiores que o padrão para facilitar a leitura.
 */

export type ModoTema = 'claro' | 'escuro';

export interface CoresTema {
  fundo: string;
  superficie: string;
  superficieSutil: string;
  borda: string;
  texto: string;
  textoSecundario: string;
  textoSuave: string;
  primaria: string;
  primariaClara: string;
  textoSobrePrimaria: string;
  destaque: string;
  destaqueClaro: string;
  sucesso: string;
  sucessoClaro: string;
  erro: string;
  erroClaro: string;
  aviso: string;
  avisoClaro: string;
}

export const coresClaras: CoresTema = {
  fundo: '#F7F5F0',
  superficie: '#FFFFFF',
  superficieSutil: '#EFEBE3',
  borda: '#E2DDD2',
  texto: '#1F2A28',
  textoSecundario: '#55625F',
  textoSuave: '#7D8885',
  primaria: '#2E6F68',
  primariaClara: '#E1F0EC',
  textoSobrePrimaria: '#FFFFFF',
  destaque: '#C8664B',
  destaqueClaro: '#FBE9E3',
  sucesso: '#2F7D52',
  sucessoClaro: '#E2F3E8',
  erro: '#B83A2A',
  erroClaro: '#FBE4E0',
  aviso: '#9A6A12',
  avisoClaro: '#FBF0D9',
};

export const coresEscuras: CoresTema = {
  fundo: '#111816',
  superficie: '#1A2421',
  superficieSutil: '#22302C',
  borda: '#2E3D39',
  texto: '#EEF2F0',
  textoSecundario: '#B3C0BC',
  textoSuave: '#85938F',
  primaria: '#6CC1B4',
  primariaClara: '#1F3A35',
  textoSobrePrimaria: '#0E2420',
  destaque: '#E8957C',
  destaqueClaro: '#3A2620',
  sucesso: '#6FCF97',
  sucessoClaro: '#1C3327',
  erro: '#F08C7D',
  erroClaro: '#3D201C',
  aviso: '#E9C46A',
  avisoClaro: '#3A3020',
};

/** Famílias carregadas em src/app/_layout.tsx (Google Fonts: Nunito). */
export const fontes = {
  regular: 'Nunito_400Regular',
  media: 'Nunito_600SemiBold',
  negrito: 'Nunito_700Bold',
  extraNegrito: 'Nunito_800ExtraBold',
};

/** Escala de texto um pouco maior que o padrão, por acessibilidade. */
export const tamanhos = {
  legenda: 14,
  corpo: 17,
  subtitulo: 19,
  titulo: 24,
  tituloGrande: 30,
};

export const espacos = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const raios = {
  sm: 8,
  md: 14,
  lg: 20,
  pilula: 999,
};

/** Área mínima de toque recomendada pelas guidelines (Material: 48dp). */
export const ALTURA_MINIMA_TOQUE = 52;
