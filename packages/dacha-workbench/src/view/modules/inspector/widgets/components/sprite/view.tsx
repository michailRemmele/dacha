import { useMemo, FC } from 'react'
import type { GlobalOption } from 'dacha'

import type { References, WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { useConfig } from '../../../../../hooks'

export const SpriteWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const globalOptions = useConfig(['globalOptions']) as Array<GlobalOption>

  const items = useMemo(() => {
    const sortingLayersOption = globalOptions.find((option) => option.name === 'sortingLayers')
    const sortingLayers = sortingLayersOption?.value
    return (sortingLayers as Array<string> | undefined ?? []).map((layer) => ({
      title: layer,
      value: layer,
    }))
  }, [globalOptions])

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
