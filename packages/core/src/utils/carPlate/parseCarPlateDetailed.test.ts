import { parseCarPlateDetailed } from './parseCarPlate'

it('разделяет обычный номер с 2х-значным регионом: с065мк78', () => {
  const SHORT_REGULAR_NUMBER = 'с065мк78'
  const BASE = ['с', '065', 'мк']
  const REGION = '78'
  const { plateBase, plateRegion } = parseCarPlateDetailed(SHORT_REGULAR_NUMBER) || {}
  expect(plateBase).toEqual(BASE)
  expect(plateRegion).toEqual(REGION)
})

it('разделяет обычный номер с 3х-значным регионом: с065мк999', () => {
  const LONG_REGULAR_NUMBER = 'с065мк999'
  const BASE = ['с', '065', 'мк']
  const REGION = '999'
  const { plateBase, plateRegion } = parseCarPlateDetailed(LONG_REGULAR_NUMBER) || {}
  expect(plateBase).toEqual(BASE)
  expect(plateRegion).toEqual(REGION)
})

it('разделяет обычный номер с 3х-значным регионом: н931кх799', () => {
  const LONG_REGULAR_NUMBER = 'н931кх799'
  const BASE = ['н', '931', 'кх']
  const REGION = '799'
  const { plateBase, plateRegion } = parseCarPlateDetailed(LONG_REGULAR_NUMBER) || {}
  expect(plateBase).toEqual(BASE)
  expect(plateRegion).toEqual(REGION)
})

it('разделяет обычный номер с 3х-значным регионом: у053ум777', () => {
  const LONG_REGULAR_NUMBER = 'у053ум777'
  const BASE = ['у', '053', 'ум']
  const REGION = '777'
  const { plateBase, plateRegion } = parseCarPlateDetailed(LONG_REGULAR_NUMBER) || {}
  expect(plateBase).toEqual(BASE)
  expect(plateRegion).toEqual(REGION)
})

it('разделяет номер легкового такси: от70177 (кейс из jira)', () => {
  const TAXI_NUMBER_PLATE = 'от70177'
  const BASE = ['от', '701']
  const REGION = '77'
  const { plateBase, plateRegion } = parseCarPlateDetailed(TAXI_NUMBER_PLATE) || {}
  expect(plateBase).toEqual(BASE)
  expect(plateRegion).toEqual(REGION)
})

it('undefined на невалидный номер', () => {
  const NUMBER_PLATE = 'hello world'
  const result = parseCarPlateDetailed(NUMBER_PLATE)
  expect(result).toEqual(undefined)
})
