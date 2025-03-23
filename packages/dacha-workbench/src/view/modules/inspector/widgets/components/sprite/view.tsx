import { useMemo, FC } from 'react'

import type { References, WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { useConfig } from '../../../../../hooks'
import type { SortingLayer } from '../../types/sprite-renderer'

const PATH = ['globalOptions', 'name:sortingLayers', 'options', 'layers']

export const SpriteWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const layersConfig = useConfig(PATH) as SortingLayer[] | undefined

  const items = useMemo(() => (layersConfig ?? []).map((layer) => ({
    title: layer.name,
    value: layer.name,
  })), [layersConfig])

  const extReferences: References = useMemo(() => ({
    ...references,
    sortingLayers: {
      items,
    },
  }), [references, items])

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  )
}
