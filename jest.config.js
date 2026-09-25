/** @type {import('jest').Config} */
export default {
  // MSW v2 を jsdom で動かすため、fetch / Request などを Node 標準に揃えた環境を使う
  testEnvironment: 'jest-fixed-jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  // MSW の依存にはESMのみで配布されているパッケージがあるため、それらと .mjs だけ変換する
  transformIgnorePatterns: ['/node_modules/(?!(until-async|@inquirer)/).+\\.(?!mjs$)[^.]+$'],
  transform: {
    '^.+\\.(m?j|t)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    // import.meta.env は Jest(CommonJS) で解釈できないため、設定値だけ差し替える
    '^.+/appConfig$': '<rootDir>/src/test/appConfig.ts',
  },
}
