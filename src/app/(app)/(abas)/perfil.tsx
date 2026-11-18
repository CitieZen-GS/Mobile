import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Botao, Cartao, Icone, NomeIcone, Selo, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { confirmar } from '@/utils/confirmacao';

interface ItemMenuProps {
  icone: NomeIcone;
  titulo: string;
  descricao: string;
  aoPressionar: () => void;
}

function ItemMenu({ icone, titulo, descricao, aoPressionar }: ItemMenuProps) {
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
        <ItemMenu
          icone="people-outline"
          titulo="Meus idosos"
          descricao="Cadastre, edite ou escolha quem acompanhar"
          aoPressionar={() => router.push('/idosos')}
        />
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
