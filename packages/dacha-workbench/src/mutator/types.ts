export type DataSimpleValue = string | number | boolean
export interface DataObjectValue {
  [key: string]: DataSimpleValue | DataObjectValue | Array<DataSimpleValue> | Array<DataObjectValue>
}
export type DataValue = DataSimpleValue | DataObjectValue | Array<DataValue>

export type Data = Record<string, DataValue>

export type ListenerFn = (path: Array<string>, value: DataValue) => void
