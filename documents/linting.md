# Линтинг

### Установка / настройка

1. Установить `concurrently`

```sh
npm i --save-dev concurrently
```

2. Добавить следующие скрипты

```json
{
  "scripts": {
    "lint": "eslint './src/**/*.{ts,tsx}'",
    "lint:fix": "eslint './src/**/*.{ts,tsx}' --fix",
    "stylelint": "stylelint './src/**/*.{scss,css}'",
    "stylelint:fix": "stylelint './src/**/*.{scss,css}' --fix",
    "tsc": "tsc --project tsconfig.json",
    "lint:all": "concurrently --kill-others-on-fail \"npm:lint\" \"npm:tsc\" \"npm:stylelint\""
  }
}
```

### Эксплуатация в локальном окружение

Вызов команды `npm run lint:all` запустит процесс линтинга файла в многопоточном режиме. При наличии проблем скрипт выйдет со статус кодом 1 (завершится с ошибкой).

### Эксплуатация в CI

Добавить в `.gitlab-ci.yml` джобу с вызовом линтеров. Джоба будет запускаться на каждом МРе.

```yaml
stages:
  - linting

linting:
  stage: linting
  image: mhart/alpine-node:14
  script:
    - npm ci
    - npm run lint:all
  only:
    - merge_requests
  tags:
    - docker
```
