import { Actor } from 'remiz'

export const getAncestor = (actor: Actor): Actor => {
  if (actor.parent instanceof Actor) {
    return getAncestor(actor.parent)
  }

  return actor
}
