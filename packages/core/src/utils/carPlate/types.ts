export interface CarPlate {
  /** серия и регистрационный номер, пример: 'с065мк' **/
  plateBase: string
  /** номер региона, пример: '999' **/
  plateRegion: string
}

export interface CarPlateDetailed {
  /** серия и регистрационный номер, пример: '['с', '065', 'мк'] **/
  plateBase: string[]
  /** номер региона, пример: '999' **/
  plateRegion: string
}
