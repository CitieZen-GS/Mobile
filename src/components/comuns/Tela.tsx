import { router } from 'expo-router';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Icone } from './Icone';
import { Texto } from './Texto';

interface TelaProps {
  children: ReactNode;
  titulo?: string;
  subtitulo?: string;
  /** Mostra o botão de voltar no cabeçalho (telas empilhadas). */
  comVoltar?: boolean;
  /** Elemento à direita do cabeçalho (ex.: botão de excluir). */
  acaoDireita?: ReactNode;
  /** Envolve o conteúdo em ScrollView (padrão). Use false para telas com FlatList. */
  rolavel?: boolean;
  /** Bordas protegidas pela safe area. Telas dentro de abas não precisam da borda inferior. */
  bordas?: Edge[];
}

/** Estrutura padrão de tela: safe area, cabeçalho, teclado e rolagem. */
export function Tela({
  children,
  titulo,
  subtitulo,
  comVoltar = false,
  acaoDireita,
  rolavel = true,
  bordas = ['top', 'bottom'],
}: TelaProps) {
  const { cores } = useTema();

  const cabecalho = (titulo || comVoltar) && (
    <View style={estilos.cabecalho}>
      {comVoltar && (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          style={[estilos.voltar, { backgroundColor: cores.superficieSutil }]}
        >
          <Icone nome="arrow-back" cor={cores.texto} />
        </Pressable>
      )}
      <View style={estilos.titulos}>
        {titulo && (
          <Texto variante="titulo" accessibilityRole="header">
            {titulo}
          </Texto>
        )}
        {subtitulo && <Texto cor="textoSecundario">{subtitulo}</Texto>}
      </View>
      {acaoDireita}
    </View>
  );

  return (
    <SafeAreaView edges={bordas} style={[estilos.raiz, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView
        style={estilos.raiz}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {rolavel ? (
          <ScrollView
            contentContainerStyle={estilos.conteudo}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {cabecalho}
            {children}
          </ScrollView>
        ) : (
          <View style={[estilos.raiz, estilos.conteudoFixo]}>
            {cabecalho}
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  conteudo: { flexGrow: 1, padding: espacos.md, gap: espacos.md, paddingBottom: espacos.xl },
  conteudoFixo: { padding: espacos.md, paddingBottom: 0, gap: espacos.md },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  titulos: { flex: 1 },
  voltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
