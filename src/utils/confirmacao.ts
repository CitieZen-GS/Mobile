import { Alert, Platform } from 'react-native';

/** Mensagem simples (ex.: erro ao executar uma ação rápida fora de formulário). */
export function mostrarAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
}

/**
 * Pergunta de confirmação (ex.: antes de excluir).
 * No celular usa o Alert nativo; no navegador, o window.confirm.
 */
export function confirmar(titulo: string, mensagem: string, textoConfirmar = 'Excluir') {
  return new Promise<boolean>((resolver) => {
    if (Platform.OS === 'web') {
      resolver(window.confirm(`${titulo}\n\n${mensagem}`));
      return;
    }
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolver(true) },
      ],
      { cancelable: true, onDismiss: () => resolver(false) },
    );
  });
}
