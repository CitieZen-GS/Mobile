import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { BotaoFlutuante, Carregando, EstadoVazio, MensagemErro, Tela } from '@/components/comuns';
import { CartaoIdoso } from '@/components/idosos/CartaoIdoso';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';
import { useIdosos } from '@/hooks/useIdosos';
import { extrairMensagemErro } from '@/services/api';
import { espacos } from '@/styles/tema';

/** Lista os idosos sob responsabilidade do cuidador logado (GET /idosos?idCuidador=). */
export default function TelaIdosos() {
  const { cores } = useTema();
  const { usuario } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const { data: idosos, isLoading, isError, error, refetch, isRefetching } = useIdosos(usuario?.id);

  const abrirNovo = () => router.push('/idosos/novo');

  let conteudo;
  if (isLoading) {
    conteudo = <Carregando mensagem="Buscando idosos..." />;
  } else if (isError) {
    conteudo = <MensagemErro mensagem={extrairMensagemErro(error)} aoTentarNovamente={refetch} />;
  } else {
    conteudo = (
      <FlatList
        data={idosos}
        keyExtractor={(idoso) => String(idoso.id)}
        contentContainerStyle={estilos.lista}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            colors={[cores.primaria]}
            tintColor={cores.primaria}
          />
        }
        ListEmptyComponent={
          <EstadoVazio
            icone="people-outline"
            titulo="Nenhum idoso cadastrado"
            descricao="Cadastre a pessoa que você cuida para começar a registrar a rotina dela."
            tituloAcao="Cadastrar idoso"
            aoAgir={abrirNovo}
          />
        }
        renderItem={({ item }) => (
          <CartaoIdoso
            idoso={item}
            selecionado={item.id === idIdoso}
            aoPressionar={() =>
              router.push({ pathname: '/idosos/[id]', params: { id: String(item.id) } })
            }
          />
        )}
      />
    );
  }

  return (
    <Tela
      titulo="Meus idosos"
      subtitulo="Toque para ver ou editar a ficha"
      comVoltar
      rolavel={false}
    >
      {conteudo}
      {!!idosos?.length && (
        <BotaoFlutuante aoPressionar={abrirNovo} rotuloAcessivel="Cadastrar novo idoso" />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: espacos.md, paddingBottom: 120, flexGrow: 1 },
});
