export type NotificationHandlersNames = 'onclick' | 'onclose' | 'onerror' | 'onshow'
export type NotificationHandlers = Partial<Pick<Notification, NotificationHandlersNames>>
