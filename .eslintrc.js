module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
      extraFileExtensions: ['.svelte']
    },
    env: {
      es6: true,
      browser: true
    },
    overrides: [
      {
        files: ['*.svelte'],
        processor: 'svelte3/svelte3',
        rules:{
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-return": "off",
          "@typescript-eslint/no-unsafe-member-access":"off",
          "@typescript-eslint/restrict-template-expressions":"off"
        }
      }
    ],
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx",".d.ts"]
        },
        "typescript": {
          "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
  
          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
  
          // // use <root>/path/to/folder/tsconfig.json
          // "project": "path/to/folder",
  
          // // Multiple tsconfigs (Useful for monorepos)
  
          // // use a glob pattern
          // "project": "packages/*/tsconfig.json",
  
          // // use an array
          // "project": [
          //   "packages/module-a/tsconfig.json",
          //   "packages/module-b/tsconfig.json"
          // ],
  
          // // use an array of glob patterns
          // "project": [
          //   "packages/*/tsconfig.json",
          //   "other-packages/*/tsconfig.json"
          // ]
        }
      },
      'svelte3/typescript': require('typescript'),
      // ignore style tags in Svelte because of Tailwind CSS
      // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
      'svelte3/ignore-styles': () => true
    },
    plugins: ['svelte3', '@typescript-eslint','import'],
    ignorePatterns: ['node_modules']
  }

