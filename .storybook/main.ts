import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // アプリ本体の複数ページ入力（index.html / legacy.html）はStorybookのビルドには不要なので外す
  viteFinal: async (viteConfig) => {
    if (viteConfig.build?.rollupOptions) delete viteConfig.build.rollupOptions.input
    return { ...viteConfig, base: './' }
  },
}

export default config
