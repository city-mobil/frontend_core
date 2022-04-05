import { MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react'

const isTouchScreen = () => 'ontouchstart' in document.documentElement

type PressHandler = (() => void) | null

type MobileType = {
  onTouchStart: () => void
  onTouchEnd: () => void
  onTouchMove: () => void
  onTouchCancel: () => void
}
type WebType = {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseMove: () => void
}
type ReturnValueType = { onContextMenu: (e: MouseEvent) => void } & (MobileType | WebType)

/**
 * Биндинг долгого нажатия
 * @param onLongPress callback на долгое нажатие
 * @param onPress callback на обычное нажатие
 * @param threshold время, через которое срабатывает долгое нажатие
 */
export const useLongPress = (onLongPress: PressHandler, onPress?: PressHandler, threshold = 500): ReturnValueType => {
  const onLongPressRef = useRef(onLongPress)
  const onPressRef = useRef(onPress)
  const shouldShortPress = useRef(true)
  const timeout = useRef<number>()

  useEffect(() => {
    onLongPressRef.current = onLongPress
    onPressRef.current = onPress
  }, [onLongPress, onPress])

  const onTouchStart = useCallback(() => {
    shouldShortPress.current = true

    timeout.current = window.setTimeout(() => {
      shouldShortPress.current = false
      if (onLongPressRef.current) {
        onLongPressRef.current()
      }
    }, threshold)
  }, [threshold])

  const onTouchEnd = useCallback(() => {
    clearTimeout(timeout.current)
    if (onPressRef.current && shouldShortPress.current) {
      onPressRef.current()
    }
  }, [])

  const onTouchMove = useCallback(() => {
    shouldShortPress.current = false
    clearTimeout(timeout.current)
  }, [])

  const onTouchCancel = useCallback(() => {
    clearTimeout(timeout.current)
  }, [])

  const onContextMenu = useCallback((e: MouseEvent) => e.preventDefault(), [])

  const result: ReturnValueType = useMemo(() => {
    const mobile: MobileType = {
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onTouchCancel,
    }
    const web: WebType = {
      onMouseDown: onTouchStart,
      onMouseUp: onTouchEnd,
      onMouseMove: onTouchMove,
    }

    return {
      onContextMenu,
      ...(isTouchScreen() ? mobile : web),
    }
  }, [onContextMenu, onTouchCancel, onTouchEnd, onTouchMove, onTouchStart])

  return result
}
