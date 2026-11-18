import { Pressable, StyleSheet } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Icone } from './Icone';

interface BotaoFlutuanteProps {
  aoPressionar: () => void;
  rotuloAcessivel: string;
}

/** Botão "+" fixo no canto inferior direito, para criar um novo registro. */
export function BotaoFlutuante({ aoPressionar, rotuloAcessivel }: BotaoFlutuanteProps) {
  const { cores } = useTema();

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: cores.primaria },
        pressed && estilos.pressionado,
      ]}
    >
      <Icone nome="add" tamanho={32} cor={cores.textoSobrePrimaria} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    position: 'absolute',
    right: espacos.lg,
    bottom: espacos.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pressionado: { opacity: 0.8 },
});
