import { StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Cartao } from './Cartao';
import { Icone, NomeIcone } from './Icone';
import { Texto } from './Texto';

interface ItemMenuProps {
  icone: NomeIcone;
  titulo: string;
  descricao: string;
  aoPressionar: () => void;
}

/** Atalho em forma de cartão (ícone, título, descrição e seta) que abre outra tela. */
export function ItemMenu({ icone, titulo, descricao, aoPressionar }: ItemMenuProps) {
  const { cores } = useTema();
  return (
    <Cartao aoPressionar={aoPressionar} rotuloAcessivel={titulo}>
      <View style={estilos.linha}>
        <Icone nome={icone} cor={cores.primaria} tamanho={26} />
        <View style={estilos.textos}>
          <Texto variante="corpoNegrito">{titulo}</Texto>
          <Texto variante="legenda" cor="textoSecundario">
            {descricao}
          </Texto>
        </View>
        <Icone nome="chevron-forward" cor={cores.textoSuave} />
      </View>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  textos: { flex: 1, gap: 2 },
});
