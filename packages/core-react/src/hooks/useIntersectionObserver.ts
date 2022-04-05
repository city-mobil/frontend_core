import { useCallback, useState } from 'react'

type ReturnValueType = { setRef: (node: any) => void; inView: boolean }

interface IntersectionObserverOptions {
  /**
   * Элемент который используется в качестве области просмотра
   * для проверки видимости целевого элемента.
   *
   * Должен быть предком целевого элемента.
   *
   * По умолчанию используется область видимости браузера
   * если не определён или имеет значение null.
   *
   * Если по какой-то причине получили ошибку при создании
   * observer объекта, то устанавливаем document.body
   */
  root?: Element | null

  /**
   * Отступы вокруг root.
   *
   * Могут иметь значения как свойство css margin: "10px 20px 30px 40px" (top, right, bottom, left).
   * Значения можно задавать в процентах.
   * По умолчанию все параметры установлены в нули.
   */
  rootMargin?: string

  /**
   * Число или массив чисел, указывающий, при каком проценте видимости
   * целевого элемента inView вернет true.
   *
   * Например: [0, 0.25, 0.5, 0.75, 1]
   * В этом случае inView вернет true при появлении в зоне видимости каждый 25% целевого элемента.
   */
  threshold?: number | number[]

  /**
   * Флаг, который отвечает за то, что регистрируется ли
   * только первое появление элемента или
   * каждое последующее тоже.
   */
  triggerOnce?: boolean
}

/**
 * Хук для обнаружения пересечения элемента с viewport
 *
 * Для корректной работы в старых браузерах необходим полифил
 * https://www.npmjs.com/package/intersection-observer-polyfill
 *
 * В отличие от либы react-intersection-observer
 * этот хук может обрабатывать кейсы, где IntersectionObserverApi
 * ведет себя некорректно, как например на iOS < 12.2
 *
 * По сути работает точно также, только в случае ошибки
 * обрабатывает ее и устанавливает другой объект root.
 *
 */
export const useIntersectionObserver = ({
  rootMargin,
  threshold,
  root = null,
  triggerOnce = false,
}: IntersectionObserverOptions): ReturnValueType => {
  const [inView, setInView] = useState(false)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const entry = entries[0]

      // intersectionRatio нужно обрабатывать для старых версий,
      // так там некорректно работает isIntersecting
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        setInView(true)

        if (triggerOnce) {
          observer.unobserve(entry.target)
        }
      } else {
        setInView(false)
      }
    },
    [triggerOnce],
  )

  const setRef = useCallback(
    (node: Element) => {
      if (node) {
        let observer = null

        try {
          observer = new IntersectionObserver(handleObserver, { rootMargin, threshold, root })
        } catch (e) {
          observer = new IntersectionObserver(handleObserver, { rootMargin, threshold, root: document.body })
        }

        observer?.observe(node)
      }
    },
    [handleObserver, rootMargin, threshold, root],
  )

  return { setRef, inView }
}
