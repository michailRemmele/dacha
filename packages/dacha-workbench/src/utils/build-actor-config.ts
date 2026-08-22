import { uuid } from './uuid'
import type { TemplateConfig, ActorConfig } from 'dacha'

export const buildActorConfig = (template: TemplateConfig): ActorConfig => ({
  id: uuid(),
  templateId: template.id,
  name: template.name,
  components: [],
  children: template.children?.map((child) => buildActorConfig(child)),
})
