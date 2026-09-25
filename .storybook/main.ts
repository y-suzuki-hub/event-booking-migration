import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  staticDirs: ['./static'],
  // アプリ本体の複数ページ入力（index.html / legacy.html）と public/（CSP・Service Worker）はStorybookには不要なので外す
  viteFinal: async (viteConfig) => {
    if (viteConfig.build?.rollupOptions) delete viteConfig.build.rollupOptions.input
    return { ...viteConfig, base: './', publicDir: false }
  },
}

export default config
