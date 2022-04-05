# `@city/core`

### Подключение пакета

```sh
npm install @city/core
```

## doRequest

Пример использования

```ts
import { AsyncParticle } from './models'
import { doRequest, getAsyncParticle, isFailed, isFetching } from './util'

// Переменные для хранения состояния запросов
// Состояние в них обновляется не напрямую, а через вызовы doRequest
const _items: AsyncParticle<GetItems> = getAsyncParticle()
const _postItem: AsyncParticle<PostItemResponse, PostItemParams> = getAsyncParticle()

// Хэлперы для получения статуса загрузки данных
const isFetchingItems = () => isFetching(isFetching(this._items))
const isItemsFetchingFailed = () => isFailed(this._items)

// Геттер для доступа к данным
const items = () => this._items.data?.items || []

// Отправка GET запроса без параметров
const getItems = async () => {
  request = () => axios.get<GetItems>('/items')
  try {
    await doRequest(this._items, request, null)
  } catch (e) {
    // логгирование или другая обработка ошибки

    throw e
  }
}

// Отправка данных в POST запросе
const addItem = async (item: item) => {
  request = (item) => axios.post<PostItemResponse, PostItemParams>('/item', item)
  try {
    await doRequest(this._addItem, request, item)
  } catch (e) {
    // логгирование или другая обработка ошибки

    throw e
  }
}
```
