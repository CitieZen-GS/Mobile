import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, NomeIcone, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';

interface SecaoResumoProps {
  titulo: string;
  icone: NomeIcone;
  quantidade: number;
  textoVazio: string;
  children: ReactNode;
  aoVerTodos?: () => void;
}

/** Bloco da tela inicial (ex.: "Medicamentos de hoje") com contagem e lista. */
export function SecaoResumo({
  titulo,
  icone,
  quantidade,
  textoVazio,
  children,
  aoVerTodos,
}: SecaoResumoProps) {
  const { cores } = useTema();

  return (
    <Cartao aoPressionar={aoVerTodos} rotuloAcessivel={`${titulo}: ${quantidade} itens`}>
      <View style={estilos.cabecalho}>
        <View style={[estilos.icone, { backgroundColor: cores.primariaClara }]}>
          <Icone nome={icone} cor={cores.primaria} />
        </View>
        <Texto variante="subtitulo" style={estilos.titulo}>
          {titulo}
        </Texto>
        <Texto variante="corpoNegrito" cor="primaria">
          {quantidade}
        </Texto>
        {aoVerTodos && <Icone nome="chevron-forward" cor={cores.textoSuave} />}
      </View>
      {quantidade === 0 ? <Texto cor="textoSuave">{textoVazio}</Texto> : children}
    </Cartao>
  );
}

interface ItemResumoProps {
  titulo: string;
  detalhe?: string | null;
  hora?: string;
}

/** Linha de um item dentro da SecaoResumo. */
export function ItemResumo({ titulo, detalhe, hora }: ItemResumoProps) {
  const { cores } = useTema();

  return (
    <View style={[estilos.item, { borderTopColor: cores.borda }]}>
      {hora ? (
        <Texto variante="corpoNegrito" cor="destaque" style={estilos.hora}>
          {hora}
        </Texto>
      ) : null}
      <View style={estilos.textos}>
        <Texto variante="corpoNegrito">{titulo}</Texto>
        {detalhe ? (
          <Texto variante="legenda" cor="textoSecundario">
            {detalhe}
          </Texto>
        ) : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { flex: 1 },
  item: {
    flexDirection: 'row',
    gap: espacos.md,
    paddingTop: espacos.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hora: { minWidth: 52 },
  textos: { flex: 1 },
});
