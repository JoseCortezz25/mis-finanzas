import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    ignorePatterns: ['./src/components/ui/**'],
    plugins: ['@typescript-eslint'],
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
      'jsx-quotes': ['warn', 'prefer-double'],
      semi: [2, 'always'],
      'space-before-function-paren': ['off'],
      camelcase: [
        'error',
        {
          allow: [
            'api_url',
            'Geist_Mono',
            'category_id',
            'budget_id',
            'payment_method',
            'total_amount',
            'is_custom',
            '_cached_at',
            '_pending_sync',
            'user_id',
            'required_error',
            'spent_amount',
            'percentage_used',
            'health_status',
            'available_amount',
          ]
        }
      ],
      'no-unused-vars': 'off',
      'comma-dangle': [
        'error',
        {
          functions: 'never'
        }
      ]
    }
  })
];

export default eslintConfig;
