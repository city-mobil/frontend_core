import { useEffect, useRef } from 'react'

/**
 * Хук, позволяющий использовать актуальную версию callback-функции в хуках эффекта без добавления ее в список зависимостей
 * хука эффекта (идея взята с https://usehooks.com/useEventListener/).
 *
 * @param handler Актуальная версия callback-функции.
 * @returns Геттер для получения актуальной версии callback-функции. Геттер следует вызывать внутри хука эффекта.
 */
export const useLiveHandler = <T extends VoidFunction>(handler: T): (() => T) => {
  const handlerRef = useRef<T>()

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  return () => ((...args) => handlerRef.current?.apply(null, args)) as T
}
