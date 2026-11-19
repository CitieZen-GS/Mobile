import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Botao, Cartao, ItemMenu, Selo, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { confirmar } from '@/utils/confirmacao';

export default function TelaPerfil() {
  const { cores } = useTema();
  const { usuario, ehCuidador, sair } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();

  const confirmarSaida = async () => {
    const confirmado = await confirmar(
      'Sair da conta',
      'Você precisará entrar novamente para acessar o app.',
      'Sair',
    );
    if (confirmado) {
      // O guard do layout raiz leva de volta ao login
      await sair();
    }
  };

  return (
    <Tela titulo="Perfil" bordas={['top']}>
      <Cartao>
        <View style={estilos.linha}>
          <View style={[estilos.avatar, { backgroundColor: cores.primaria }]}>
            <Texto variante="titulo" style={{ color: cores.textoSobrePrimaria }}>
              {usuario?.nome.charAt(0).toUpperCase()}
            </Texto>
          </View>
          <View style={estilos.textos}>
            <Texto variante="subtitulo">{usuario?.nome}</Texto>
            <Texto cor="textoSecundario">{usuario?.email}</Texto>
            <Selo
              texto={ehCuidador ? 'Cuidador(a)' : 'Familiar · somente leitura'}
              tom={ehCuidador ? 'primario' : 'aviso'}
            />
          </View>
        </View>
      </Cartao>

      {ehCuidador ? (
        <>
          <ItemMenu
            icone="people-outline"
            titulo="Meus idosos"
            descricao="Cadastre, edite ou escolha quem acompanhar"
            aoPressionar={() => router.push('/idosos')}
          />
          {idIdoso !== undefined && (
            <ItemMenu
              icone="person-add-outline"
              titulo="Cadastrar familiar"
              descricao="Crie o acesso de quem vai acompanhar o idoso"
              aoPressionar={() =>
                router.push({ pathname: '/familiar/novo', params: { idIdoso: String(idIdoso) } })
              }
            />
          )}
          <ItemMenu
            icone="chatbubbles-outline"
            titulo="Assistente com IA"
            descricao="Pergunte sobre a rotina registrada"
            aoPressionar={() => router.push('/assistente')}
          />
          <ItemMenu
            icone="document-text-outline"
            titulo="Relatórios"
            descricao="Resumos do período para a consulta ou a família"
            aoPressionar={() => router.push('/relatorios')}
          />
        </>
      ) : (
        idIdoso !== undefined && (
          <ItemMenu
            icone="id-card-outline"
            titulo="Ficha do idoso"
            descricao="Dados de saúde e observações"
            aoPressionar={() =>
              router.push({ pathname: '/idosos/[id]', params: { id: String(idIdoso) } })
            }
          />
        )
      )}

      <ItemMenu
        icone="information-circle-outline"
        titulo="Sobre o App"
        descricao="Versão, commit de referência e ODS"
        aoPressionar={() => router.push('/sobre')}
      />

      <Botao
        titulo="Sair da conta"
        icone="log-out-outline"
        variante="perigo"
        aoPressionar={confirmarSaida}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  textos: { flex: 1, gap: 2 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
