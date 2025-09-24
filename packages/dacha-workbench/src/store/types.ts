export type DataSimpleValue = string | number | boolean
export interface DataObjectValue {
  [key: string]: DataSimpleValue | DataObjectValue | DataSimpleValue[] | DataObjectValue[]
}
export type DataValue = DataSimpleValue | DataObjectValue | DataValue[]

export type Data = Record<string, DataValue>

export type ListenerFn = (path: string[], value?: DataValue) => void
