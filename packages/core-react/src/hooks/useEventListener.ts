import { useEffect } from 'react'

import { useLiveHandler } from './useLiveHandler'

/**
 * Хук для подписки на события DOM-элементов.
 *
 * @param eventName Имя события.
 * @param handler Callback-функция, срабатывающая при обработке события.
 * @param target Реф DOM-элемента, на событие которого производится подписка.
 * @param options Параметры подписки.
 * @param [options.active=true] Если true, то подписка активна, если false - то неактивна, при этом внутренний
 *  обработчик события удаляется.
 * @param [capture=false] Если true, то используется фаза перехвата, иначе - фаза всплытия.
 */
export const useEventListener = (
  eventName: string,
  handler: VoidFunction,
  target: Node | null | undefined,
  { active = true, capture = false },
): void => {
  const getHandler = useLiveHandler(handler)

  useEffect(() => {
    if (!active || !target) {
      return
    }

    const eventHandler = getHandler()

    target.addEventListener(eventName, eventHandler, capture)

    return () => target?.removeEventListener(eventName, eventHandler, capture)
  }, [active, eventName, capture, target, getHandler])
}
