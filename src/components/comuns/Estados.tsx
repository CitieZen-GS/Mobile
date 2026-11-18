import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Botao } from './Botao';
import { Icone, NomeIcone } from './Icone';
import { Texto } from './Texto';

/** Indicador de carregamento com mensagem (feedback visual de requisição em andamento). */
export function Carregando({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={cores.primaria} />
      <Texto cor="textoSecundario" centralizado>
        {mensagem}
      </Texto>
    </View>
  );
}

interface MensagemErroProps {
  mensagem: string;
  aoTentarNovamente?: () => void;
}

/** Erro amigável com opção de tentar de novo. */
export function MensagemErro({ mensagem, aoTentarNovamente }: MensagemErroProps) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro} accessibilityRole="alert">
      <Icone nome="cloud-offline-outline" tamanho={48} cor={cores.erro} />
      <Texto variante="subtitulo" centralizado>
        Algo deu errado
      </Texto>
      <Texto cor="textoSecundario" centralizado>
        {mensagem}
      </Texto>
      {aoTentarNovamente && (
        <Botao
          titulo="Tentar novamente"
          icone="refresh"
          variante="secundario"
          aoPressionar={aoTentarNovamente}
        />
      )}
    </View>
  );
}

interface EstadoVazioProps {
  icone: NomeIcone;
  titulo: string;
  descricao?: string;
  tituloAcao?: string;
  aoAgir?: () => void;
}

/** Lista vazia com convite para cadastrar o primeiro item. */
export function EstadoVazio({ icone, titulo, descricao, tituloAcao, aoAgir }: EstadoVazioProps) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro}>
      <Icone nome={icone} tamanho={52} cor={cores.textoSuave} />
      <Texto variante="subtitulo" centralizado>
        {titulo}
      </Texto>
      {descricao && (
        <Texto cor="textoSecundario" centralizado>
          {descricao}
        </Texto>
      )}
      {tituloAcao && aoAgir && <Botao titulo={tituloAcao} icone="add" aoPressionar={aoAgir} />}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.md,
    padding: espacos.lg,
  },
});
