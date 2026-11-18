import { Pressable } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { Icone } from './Icone';

interface BotaoExcluirProps {
  aoPressionar: () => void;
  rotuloAcessivel: string;
}

/** Ícone de lixeira usado no cabeçalho das telas de edição. */
export function BotaoExcluir({ aoPressionar, rotuloAcessivel }: BotaoExcluirProps) {
  const { cores } = useTema();
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      hitSlop={12}
    >
      <Icone nome="trash-outline" cor={cores.erro} tamanho={26} />
    </Pressable>
  );
}
