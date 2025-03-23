import { useMemo, FC } from 'react'

import type { References, WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { useConfig } from '../../../../../hooks'
import type { AudioGroup } from '../../types/audio-system'

type GroupOption = {
  title: string
  value: string
}

const PATH = ['globalOptions', 'name:audioGroups', 'options', 'groups']
const MASTER_GROUP = 'master'

export const AudioSourceWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const groupsConfig = useConfig(PATH) as AudioGroup[]

  const items = useMemo(() => (groupsConfig ?? []).reduce((acc, group) => {
    acc.push({
      title: group.name,
      value: group.name,
    })
    return acc
  }, [{ title: MASTER_GROUP, value: MASTER_GROUP }] as GroupOption[]), [groupsConfig])

  const extReferences: References = useMemo(() => ({
    ...references,
    audioGroups: {
      items,
    },
  }), [references, items])

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  )
}
