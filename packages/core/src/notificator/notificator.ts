import { IS_SAFARI } from '../utils'
import { NotificationHandlers } from './types'

export class Notificator {
  private options: NotificationOptions = {}

  public get isExist(): boolean {
    return 'Notification' in window
  }

  public get hasPermission(): boolean {
    return this.permission() === 'granted'
  }

  public permission(): NotificationPermission {
    return this.isExist ? Notification.permission : 'denied'
  }

  public setBaseOptions(options: NotificationOptions): void {
    this.options = options
  }

  public send(
    title: string,
    options: NotificationOptions = {},
    handlers: NotificationHandlers = {},
  ): Notification | null {
    if (!this.hasPermission) return null

    const notification = new Notification(title, { ...this.options, ...options })

    if (handlers.onclick) {
      notification.onclick = handlers.onclick
    }

    if (handlers.onclose) {
      notification.onclose = handlers.onclose
    }

    if (handlers.onerror) {
      notification.onerror = handlers.onerror
    }

    if (handlers.onshow) {
      notification.onshow = handlers.onshow
    }

    return notification
  }

  public async requestPermission(callbackFunc: NotificationPermissionCallback): Promise<void> {
    if (!this.isExist) {
      return callbackFunc('denied')
    }

    if (IS_SAFARI()) {
      Notification.requestPermission(callbackFunc).catch(() => callbackFunc('denied'))
    } else {
      try {
        const permission = await Notification.requestPermission()

        callbackFunc(permission)
      } catch (e) {
        callbackFunc('denied')
      }
    }
  }
}
