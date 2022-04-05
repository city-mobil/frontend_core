# `@city/core-mobx`

### Подключение пакета

```sh
npm install @city/core-mobx
```

## mobxRequest 

Пример стора использующего mobxRequest

```ts
import { AsyncParticle } from './models'
import { getAsyncParticle, isFailed, isFetching } from './util'

interface GetItems {
  items: item[]
}

class ItemsStore {
  // приватные переменные для хранения состояния запроса
  private _items: AsyncParticle<GetItemsResponse>
  private _postItem: AsyncParticle<PostItemResponse, PostItemParams>

  constructor() {
    this._items = getAsyncParticle()
    this._addItem = getAsyncParticle()
    makeAutoObservable(this)
  }

  // статус загрузки данных
  get isFetchingItems() {
    return isFetching(isFetching(this._items))
  }

  // статус ошибки
  get isItemsFetchingFailed() {
    return isFailed(this._items)
  }

  // данные полученные в запросе
  get items() {
    return this._items.data?.items || []
  }

  //  Отправка GET запроса без параметров
  async getItems() {
    request = () => axios.get<GetItems>('/items')
    try {
      await mobxRequest(this._items, request, null)
    } catch (e) {
        
      // логгирование или другая обработка ошибки
        
      throw e
    }
  }

  // Отправка данных в POST запросе
  async addItem(item: item) {
    request = (item) => axios.post<PostItemResponse, PostItemParams>('/item', item)
    try {
      await mobxRequest(this._addItem, request, item)
    } catch (e) {
        
      // логгирование или другая обработка ошибки

      throw e
    }
  }
}
```
