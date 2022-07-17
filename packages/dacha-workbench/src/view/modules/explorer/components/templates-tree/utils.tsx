import React from 'react'
import type { TemplateConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

import { DataNodeWithPath } from '../../../../../types/tree-node'

const getHash = (path: Array<string>): string => `${path.length}-${path.join('')}`

const parseTemplate = (
  template: TemplateConfig,
  path: Array<string>,
): DataNodeWithPath => {
  const isLeaf = !template?.children?.length
  const templatePath = path.concat(template.name)

  const node: DataNodeWithPath = {
    key: getHash(templatePath),
    title: template.name,
    path: templatePath,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = templatePath.concat('children')
    node.children = template.children?.map(
      (child) => parseTemplate(child, childPath),
    )
  }

  return node
}

export const parseTemplates = (
  templates: Array<TemplateConfig>,
): Array<DataNodeWithPath> => templates.map((template) => parseTemplate(template, ['templates']))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'templates') {
    return void ''
  }

  return getHash(path)
}
