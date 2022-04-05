# `@city/eslint-config`

### Подключение пакета

```sh
npm install --save-dev eslint @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-simple-import-sort prettier @city/prettier-config @city/eslint-config
```

Создать файл `.eslintrc.json` и скопировать в него следующие правила

```json
{
  "extends": "@city/eslint-config",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
    },
    "project": "./tsconfig.json"
  },
  "rules": {}
}
```
