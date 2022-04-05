# `@city/prettier-config`

### Подключение пакета

```sh
npm install --save-dev prettier @city/prettier-config
```

Создать файл `.prettierrc.js` и скопировать в него следующие правила

```js
module.exports = {
  ...require("@city/prettier-config"),
};
```
