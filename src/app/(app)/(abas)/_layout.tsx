import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { Icone, NomeIcone } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { fontes } from '@/styles/tema';

function iconeDaAba(nome: NomeIcone) {
  function IconeAba({ color }: { color: ColorValue }) {
    // As cores das abas vêm do tema como string (tabBarActiveTintColor)
    return <Icone nome={nome} cor={color as string} tamanho={26} />;
  }
  return IconeAba;
}

/** Navegação principal por abas (barra inferior). */
export default function LayoutAbas() {
  const { cores } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          height: 68,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: fontes.media, fontSize: 13 },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: iconeDaAba('home') }} />
      <Tabs.Screen
        name="medicamentos"
        options={{ title: 'Remédios', tabBarIcon: iconeDaAba('medkit') }}
      />
      <Tabs.Screen
        name="consultas"
        options={{ title: 'Consultas', tabBarIcon: iconeDaAba('calendar') }}
      />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: iconeDaAba('person') }} />
    </Tabs>
  );
}
