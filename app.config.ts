import { execSync } from 'child_process';
import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Descobre o hash do commit que gerou o build.
 * - No build em nuvem (Expo Build), a variável EAS_BUILD_GIT_COMMIT_HASH já vem preenchida.
 * - Localmente, lê direto do git.
 * O valor é exibido na tela "Sobre o App" (requisito 7 da GS).
 */
function obterHashDoCommit(): string {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  }
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'desconhecido';
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  extra: {
    ...config.extra,
    hashDoCommit: obterHashDoCommit(),
  },
});
