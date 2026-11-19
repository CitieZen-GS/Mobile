import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, NomeIcone, Selo, Tela, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { URL_API, URL_RAG } from '@/services/api';
import { espacos } from '@/styles/tema';

const configuracao = Constants.expoConfig;
const HASH_DO_COMMIT = (configuracao?.extra?.hashDoCommit as string | undefined) ?? 'desconhecido';
const VERSAO = configuracao?.version ?? '1.0.0';

const ODS: { numero: number; nome: string }[] = [
  { numero: 3, nome: 'Saúde e bem-estar' },
  { numero: 10, nome: 'Redução das desigualdades' },
  { numero: 11, nome: 'Cidades e comunidades sustentáveis' },
];

function LinhaInfo({ icone, rotulo, valor }: { icone: NomeIcone; rotulo: string; valor: string }) {
  const { cores } = useTema();
  return (
    <View style={estilos.linha}>
      <Icone nome={icone} cor={cores.primaria} />
      <View style={estilos.textos}>
        <Texto variante="legenda" cor="textoSecundario">
          {rotulo}
        </Texto>
        <Texto variante="corpoNegrito" selectable>
          {valor}
        </Texto>
      </View>
    </View>
  );
}

/**
 * Tela "Sobre o App" (requisito 7): exibe o hash do commit que gerou este build,
 * para conferir que a versão publicada no Firebase App Distribution é a do repositório.
 */
export default function TelaSobre() {
  return (
    <Tela comVoltar titulo="Sobre o App">
      <Cartao>
        <Texto variante="subtitulo">Ajudante Familiar</Texto>
        <Texto cor="textoSecundario">
          CitizenTech para quem cuida de pessoas idosas: organiza remédios, consultas, atividades e
          alimentação, e deixa a família acompanhar tudo de perto.
        </Texto>
      </Cartao>

      <Cartao>
        <LinhaInfo icone="git-commit-outline" rotulo="Hash do commit" valor={HASH_DO_COMMIT} />
        <LinhaInfo icone="pricetag-outline" rotulo="Versão" valor={VERSAO} />
        <LinhaInfo icone="server-outline" rotulo="API" valor={URL_API} />
        <LinhaInfo icone="sparkles-outline" rotulo="Assistente (RAG)" valor={URL_RAG} />
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Objetivos de Desenvolvimento Sustentável</Texto>
        <View style={estilos.selos}>
          {ODS.map((ods) => (
            <Selo key={ods.numero} texto={`ODS ${ods.numero} · ${ods.nome}`} />
          ))}
        </View>
      </Cartao>

      <Texto variante="legenda" cor="textoSuave" centralizado>
        Global Solution 2026/2 · FIAP · Equipe CitieZen
      </Texto>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  textos: { flex: 1 },
  selos: { gap: espacos.sm },
});
