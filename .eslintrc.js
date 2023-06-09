module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'plugin:tailwindcss/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'tailwindcss'],
  rules: {
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
}
