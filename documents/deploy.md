# Руководство по публикации пакетов

### Публикация в прод

В корне пакета на ветке `master` выполнить

```sh
./tools/prod-release.sh <BUMP>
```

где `<BUMP>` - это одно из `patch`, `minor` или `major`

### Публикация в тест

В корне пакета выполнить

```sh
./tools/test-release.sh <BRANCH>
```

где `<BRANCH>` - название ветки, код которой нужно опубликовать
