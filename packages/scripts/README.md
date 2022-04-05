# `@city/scripts`

## `@city/scripts resourceLint`

Линтер ресурсов. Поддерживаемые расширения: `.svg`

---

### Контракт эксплуатации:

Проверяются все файлы, непопадающие под паттерн `*.optimized.*`. Если среди проверяемых файлов нашлись те, которые можно оптимизировать - их список будет выведен в консоль и программа завершит работу со статус-кодом `1`

### Параметры:

> --fix Применение оптимизаций / удаление не оптимизированных исходников / замена ссылок. Дефолтное значение = false  
> --extensions -e Список расширение svg | png. Дефолтное значение = [svg, png]

### Работа через `npx`

`npx` не умеет читать `.npmrc`, поэтому для работы с локальными регистри нужно явно их указывать.
Ниже по документу подразумевается, что регистри устанавливается по примеру ниже.

```shell
npm_config_registry=${NpmProxyUrl} npx @city/scripts
```

Как обойти ограничение `npx`?

```shell
npm i -D @city/scripts
```

### Примеры:

Вывести файлы, необходимые для оптимизации.

```shell
city-scripts resourceLint src/
```

Оптимизировать файлы.
Шаги оптимизатора:

1. Создать оптимизированную версию файла по паттерну `fileName.optimized.extention`
2. Заменить ссылки со старого пути на новый. `import fileName from './fileName.extention''` -> `import fileName from './fileName.optimized.extention'`
3. Удалить исходный файл

```shell
city-scripts resourceLint src/ --fix
```

Установка расширений

```shell
city-scripts resourceLint src/ -e svg png
city-scripts resourceLint src/ -e svg
```

### Локальное тестирование

1. Собираем пакет

```shell
npm run build
```

2. Линкуем пакет

```shell
npm link
```

3. Пакет будет доступен по команде

```shell
npx @city/scripts
```


## `@city/scripts webpack`

Сборка проекта вебпаком

---

### Параметры:

`start` - девсборка \
`build` - сборка проекта

### Примеры:

Запустить девсборку.

```shell
city-scripts webpack start
```

Сделать сборку.

```shell
city-scripts webpack build
```

### Кастомизация конфигурации

Необходимо в корне проект создать файл `webpack-config.js`, который экспортирует объект с двумя методами: webpack и devServer.
Метод webpack получит конфигурацию по умолчанию и объект опций (в опциях находится флаг dev - сигнализирующий об окружении) и должен вернуть изменённую конфигурацию для дальнейшего использования.
Метод devServer получит конфигурацию по умолчанию для дев сервера и должен вернуть изменённую конфигурацию для дальнейшего использования.

```js
const HOST = process.env.REACT_APP_API_HOST
const PREFIX = process.env.REACT_APP_API_PREFIX

module.exports = {
    webpack: (config, { dev }) => {
        // ваши преобразования
        return config
    },
    devServer: (config) => {
        // ваши преобразования
        config.proxy = {
            [PREFIX]: {
                target: HOST,
                changeOrigin: true,
                secure: false,
            }
        }
        
        config.https = yorsHttpsConfig
        
        
        return config
    }
}
```

### Переменные окружения

`REACT_APP_` - все переменные, имеющие данный префикс окажутся в сборке. \
`USE_ESBUILD` - включает esbuild-loader вместо babel-loader.\
`USE_LINTERS` - включает stylelint и eslint в dev режиме.\
`USE_IMG_OPT` - включает svgo в @svgr/webpack.\
`ANALYZE` - включает webpack-bundle-analyzer.

## Обратить внимание

По умолчанию в режиме dev используется esbuild, а в режиме прод - babel. Для настройки конкретного лоадера использовать переменную окружения `USE_ESBUILD`. Рекомендуется устанавливать его в файлах .env и .env.local .
