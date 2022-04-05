# Frontend core

### Монорепозиторий с общими фронт пакетами

### Список пакетов:

| Название                                   | Описание                                     | Документация                                                         |
| ------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| `@city/core`                               | набор утилит для работы с `.js .ts`          | [README.md](./packages/core/README.md)                               |
| `@city/core-mobx`                          | набор утилит для работы с `mobx`             | [README.md](./packages/core-mobx/README.md)                          |
| `@city/core-react`                         | набор утилит для работы с `react`            | [README.md](./packages/core-react/README.md)                         |
| `@city/scripts`                            | `npx && npm` скрипты                         | [README.md](./packages/scripts/README.md)                            |
| `@city/eslint-config`                      | конфиг для `eslint`                          | [README.md](./packages/eslint-config/README.md)                      |
| `@city/prettier-config`                    | конфиг для `prettier`                        | [README.md](./packages/prettier/README.md)                           |
| `@city/stylelint-config-sass`              | конфиг для `stylelint` и `.sass .scss`       | [README.md](./packages/stylelint-config-sass/README.md)              |
| `@city/stylelint-config-styled-components` | конфиг для `stylelint` и `styled-components` | [README.md](./packages/stylelint-config-styled-components/README.md) |

### Установка

Для работы любого пакета необходимо настроить проксирование `npm` в приватный регистри:

```sh
echo 'registry=${NpmProxyUrl}' > .npmrc
```

Детальная установка пакетов описана в `packages/packageName/README.md`

### Дополнительная документация

[Установка / настройка линтеров](documents/linting.md)

### Информация для разработчиков

[Работа с репозиторием](documents/start.md)  
[Публикация frontend core](documents/deploy.md)

### Disclaimer

All information and source code are provided AS-IS, without express or implied warranties.
Use of the source code or parts of it is at your sole discretion and risk.
Citymobil LLC takes reasonable measures to ensure the relevance of the information posted in this repository, but it does not assume responsibility for maintaining or updating this repository or its parts outside the framework established by the company independently and without notifying third parties.

Вся информация и исходный код предоставляются в исходном виде, без явно выраженных или подразумеваемых гарантий. Использование исходного кода или его части осуществляются исключительно по вашему усмотрению и на ваш риск. Компания ООО "Ситимобил" принимает разумные меры для обеспечения актуальности информации, размещенной в данном репозитории, но она не принимает на себя ответственности за поддержку или актуализацию данного репозитория или его частей вне рамок, устанавливаемых компанией самостоятельно и без уведомления третьих лиц.
