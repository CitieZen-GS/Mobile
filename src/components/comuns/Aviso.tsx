import { StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';
import { Icone, NomeIcone } from './Icone';
import { Texto } from './Texto';

type TomAviso = 'erro' | 'sucesso' | 'info';

interface AvisoProps {
  mensagem: string;
  tom?: TomAviso;
}

/** Faixa de aviso dentro de formulários (ex.: erro retornado pela API). */
export function Aviso({ mensagem, tom = 'erro' }: AvisoProps) {
  const { cores } = useTema();
  const paleta: Record<TomAviso, { fundo: string; texto: string; icone: NomeIcone }> = {
    erro: { fundo: cores.erroClaro, texto: cores.erro, icone: 'alert-circle' },
    sucesso: { fundo: cores.sucessoClaro, texto: cores.sucesso, icone: 'checkmark-circle' },
    info: { fundo: cores.primariaClara, texto: cores.primaria, icone: 'information-circle' },
  };
  const { fundo, texto, icone } = paleta[tom];

  return (
    <View
      style={[estilos.aviso, { backgroundColor: fundo }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Icone nome={icone} cor={texto} />
      <Texto style={[estilos.texto, { color: texto }]}>{mensagem}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    gap: espacos.sm,
    padding: espacos.md,
    borderRadius: raios.md,
    alignItems: 'flex-start',
  },
  texto: { flex: 1 },
});
