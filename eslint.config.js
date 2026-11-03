// Файл eslint.config.js

import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist'; //— сортировка импортов, объектов, типов и т.д.
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; //— запускает Prettier внутри ESLint и отключает конфликтующие правила форматирования
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports'; //— находит и удаляет неиспользуемые импорты
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh' //— проверяет готовность компонентов к Fast Refresh
import tseslint from 'typescript-eslint' //— позволяет ESLint анализировать TypeScript-код
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig(
  {
    ignores: [
      '*.config.*',
      '**/*.d.ts',
      'dist',
      'node_modules',
      'package*.json',
      'public',
      'storybook-static',
    ],
  },
  js.configs.recommended, //— базовый набор рекомендуемых правил для JS
  importPlugin.flatConfigs.recommended, //— базовые правила проверки импортов
  importPlugin.flatConfigs.typescript, //— адаптация правил импортов под TypeScript
  tseslint.configs.recommendedTypeChecked, //— рекомендуемые правила TS с учётом типов (уже включает базовые)
  tseslint.configs.stylisticTypeChecked, //— правила единообразного написания TS-кода с учётом типов
  react.configs.flat.recommended, //— базовые рекомендуемые правила для React
  react.configs.flat['jsx-runtime'], //— для React 17+: явный импорт React в JSX не нужен
  reactHooks.configs['recommended-latest'], //— рекомендуемые правила для React Hooks
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        projectService: true, //— даёт доступ к типам для правил с TypeChecked
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: globals.browser,
    },
    plugins: {
      perfectionist,
      react,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'], //— использовать type вместо interface
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true, //— запрещает импорт типа прямо внутри аннотации
          fixStyle: 'separate-type-imports', //— выносит импорт типов в отдельный импорт
          prefer: 'type-imports', //— использовать import type для импортов, которые нужны только как тип
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error', //— требует явный тип возвращаемого значения у функций
      '@typescript-eslint/explicit-module-boundary-types': 'error', //— требует явные типы у экспортируемых функций
      '@typescript-eslint/no-import-type-side-effects': 'error', //— запрещает обычный import, если все элементы — типы
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true, //— разрешает isReady && start()
          allowTernary: true, //— разрешает тернарник как инструкцию, если обе ветки что-то делают
        },
      ],
      'unused-imports/no-unused-vars': 'off', //— отключаем, проверку неиспользуемых делает typescript-eslint
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used', //— неиспользуемые параметры проверяются только после последнего использованного
          argsIgnorePattern: '^_', //— разрешает неиспользуемые параметры с именем на _
          caughtErrorsIgnorePattern: '^_', //— исключает параметры catch на _
          vars: 'all', //— проверяет все переменные, локальные и глобальные
          varsIgnorePattern: '^_', //— разрешает неиспользуемые переменные с именем на _
        },
      ],
      'no-unused-vars': 'off', //— отключаем стандартную проверку, её делает typescript-eslint
      'import/no-unresolved': 'error', //— запрещает импорт несуществующих модулей/файлов
      'import/no-unused-modules': 'error', //— запрещает экспорт того, что нигде не импортируется
      'import/order': 'off', //— отключаем в пользу eslint-plugin-perfectionist
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical', //— алфавитный порядок
          order: 'asc', //— по возрастанию Unicode (заглавные после строчных: a, A, b, B → A, B, a, b)
          groups: [
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling'],
            [
              'type-import',
              'type-internal',
              'type-parent',
              'type-sibling',
              'type-index',
            ],
            'ts-equals-import',
            'side-effect-style',
            'style',
          ],
          internalPattern: [ //— какие пути считать внутренними импортами проекта
            '^/',
            '@/',
            '^@components/',
            '^@contexts/',
            "^@hocs/",
            '^@hooks/',
            '^@pages/',
            '^@services/',
            '^@utils/',
          ],
          customGroups: { //— порядок сортировки для компонентов с дефисом и без
            value: {
              'base-components': ['/*/*/[!-]*/*.*'],
              'compound-components': ['/*/*/*-*/*.*'],
            },
          },
          newlinesBetween: 'always', //— пустые строки между группами импортов
        },
      ],
      'react/jsx-uses-react': 'off', //— React для JSX больше не нужен как импорт
      'react/jsx-uses-vars': 'error', //— помечает переменные/компоненты, используемые в JSX, как используемые
      'react/prop-types': 'off', //— не нужен при TypeScript
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], //— файл с компонентами должен экспортировать только компоненты (константы разрешены)
      'unused-imports/no-unused-imports': 'error', //— запрещает неиспользуемые импорты
      'react-hooks/exhaustive-deps': 'off' //— отключаем навязывание лишних зависимостей в useEffect и т.п.
    },
    settings: {
      react: {
        version: 'detect', //— автоопределение версии React из зависимостей
      },
      'import/resolver': {
        typescript: { //— ресолвер, понимающий TS-специфику: алиасы, .ts/.tsx, @types
          alwaysTryTypes: true, //— дополнительно искать типы, даже если модуль уже найден
          project: './tsconfig.json', //— читает tsconfig.json для paths, baseUrl и т.д.
        },
      },
    },
  },
  eslintPluginPrettierRecommended //— запускает Prettier через ESLint, отключает конфликтующие правила форматирования
);
