import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Armazenamento da sessão.
 * - Android/iOS: expo-secure-store (Keystore/Keychain, criptografado).
 * - Web (apenas para testes no navegador): localStorage, pois o SecureStore não existe na web.
 */
const naWeb = Platform.OS === 'web';

export const armazenamento = {
  async salvar(chave: string, valor: string): Promise<void> {
    if (naWeb) {
      localStorage.setItem(chave, valor);
      return;
    }
    await SecureStore.setItemAsync(chave, valor);
  },

  async ler(chave: string): Promise<string | null> {
    if (naWeb) {
      return localStorage.getItem(chave);
    }
    return SecureStore.getItemAsync(chave);
  },

  async remover(chave: string): Promise<void> {
    if (naWeb) {
      localStorage.removeItem(chave);
      return;
    }
    await SecureStore.deleteItemAsync(chave);
  },
};
