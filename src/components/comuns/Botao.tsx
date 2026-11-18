import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { ALTURA_MINIMA_TOQUE, CoresTema, espacos, raios } from '@/styles/tema';
import { Icone, NomeIcone } from './Icone';
import { Texto } from './Texto';

type VarianteBotao = 'primario' | 'secundario' | 'perigo' | 'fantasma';

interface BotaoProps {
  titulo: string;
  aoPressionar: () => void;
  variante?: VarianteBotao;
  icone?: NomeIcone;
  carregando?: boolean;
  desabilitado?: boolean;
  estilo?: ViewStyle;
}

function coresDaVariante(variante: VarianteBotao, cores: CoresTema) {
  switch (variante) {
    case 'secundario':
      return { fundo: cores.primariaClara, texto: cores.primaria, borda: cores.primariaClara };
    case 'perigo':
      return { fundo: cores.erroClaro, texto: cores.erro, borda: cores.erroClaro };
    case 'fantasma':
      return { fundo: 'transparent', texto: cores.primaria, borda: cores.borda };
    default:
      return { fundo: cores.primaria, texto: cores.textoSobrePrimaria, borda: cores.primaria };
  }
}

export function Botao({
  titulo,
  aoPressionar,
  variante = 'primario',
  icone,
  carregando = false,
  desabilitado = false,
  estilo,
}: BotaoProps) {
  const { cores } = useTema();
  const cor = coresDaVariante(variante, cores);
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: cor.fundo, borderColor: cor.borda },
        (pressed || inativo) && estilos.pressionado,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cor.texto} />
      ) : (
        <View style={estilos.conteudo}>
          {icone && <Icone nome={icone} cor={cor.texto} tamanho={20} />}
          <Texto variante="corpoNegrito" style={{ color: cor.texto }}>
            {titulo}
          </Texto>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: ALTURA_MINIMA_TOQUE,
    borderRadius: raios.md,
    borderWidth: 1.5,
    paddingHorizontal: espacos.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  pressionado: { opacity: 0.6 },
});
