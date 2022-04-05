// взято из исходного кода is.js https://github.com/arasatasaygin/is.js/blob/master/is.js#L767
const safariRegExp = /version\/(\d+).+?safari/
const userAgent = ((navigator && navigator.userAgent) || '').toLowerCase()
export const IS_SAFARI = (): boolean => {
  return !!safariRegExp.exec(userAgent)
}
