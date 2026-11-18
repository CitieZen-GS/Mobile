import { UseQueryResult } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { extrairMensagemErro } from '@/services/api';
import { espacos } from '@/styles/tema';
import { BotaoFlutuante } from './BotaoFlutuante';
import { Carregando, EstadoVazio, MensagemErro } from './Estados';
import { NomeIcone } from './Icone';
import { Tela } from './Tela';

interface TelaListaProps<T> {
  titulo: string;
  subtitulo?: string;
  consulta: UseQueryResult<T[]>;
  chave: (item: T) => string | number;
  renderizarItem: (item: T) => ReactElement;
  vazio: { icone: NomeIcone; titulo: string; descricao: string };
  /** Quando informado, mostra o botão "+" (somente cuidador). */
  aoCriar?: () => void;
  rotuloCriar?: string;
  /** Nenhum idoso selecionado: a lista não pode ser carregada. */
  semIdoso?: boolean;
  /** Conteúdo fixo acima da lista (ex.: filtros). */
  acimaDaLista?: ReactNode;
}

/**
 * Tela padrão das abas de listagem: trata carregando, erro, lista vazia,
 * puxar para atualizar e o botão de novo registro.
 */
export function TelaLista<T>({
  titulo,
  subtitulo,
  consulta,
  chave,
  renderizarItem,
  vazio,
  aoCriar,
  rotuloCriar = 'Adicionar',
  semIdoso = false,
  acimaDaLista,
}: TelaListaProps<T>) {
  const { cores } = useTema();

  let conteudo: ReactElement;
  if (semIdoso) {
    conteudo = (
      <EstadoVazio
        icone="person-outline"
        titulo="Nenhum idoso selecionado"
        descricao="Cadastre ou escolha um idoso na aba Início para ver esta lista."
      />
    );
  } else if (consulta.isLoading) {
    conteudo = <Carregando />;
  } else if (consulta.isError) {
    conteudo = (
      <MensagemErro
        mensagem={extrairMensagemErro(consulta.error)}
        aoTentarNovamente={consulta.refetch}
      />
    );
  } else {
    conteudo = (
      <FlatList
        data={consulta.data}
        keyExtractor={(item) => String(chave(item))}
        renderItem={({ item }) => renderizarItem(item)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={consulta.isRefetching}
            onRefresh={() => void consulta.refetch()}
            colors={[cores.primaria]}
            tintColor={cores.primaria}
          />
        }
        ListEmptyComponent={
          <EstadoVazio
            icone={vazio.icone}
            titulo={vazio.titulo}
            descricao={vazio.descricao}
            tituloAcao={aoCriar ? rotuloCriar : undefined}
            aoAgir={aoCriar}
          />
        }
      />
    );
  }

  return (
    <Tela titulo={titulo} subtitulo={subtitulo} rolavel={false} bordas={['top']}>
      {!semIdoso && acimaDaLista}
      {conteudo}
      {aoCriar && !semIdoso && !!consulta.data?.length && (
        <BotaoFlutuante aoPressionar={aoCriar} rotuloAcessivel={rotuloCriar} />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: espacos.md, paddingBottom: 120, flexGrow: 1 },
});
