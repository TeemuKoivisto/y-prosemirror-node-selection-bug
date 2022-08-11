import type { Command } from 'prosemirror-state'

export const createEquation =
  (pos?: number): Command =>
  (state, dispatch) => {
    const node = state.schema.nodes.equation_wrapper.createAndFill()
    if (!node) return false
    const to = pos || state.selection.head
    dispatch && dispatch(state.tr.insert(to, node).scrollIntoView())
    return true
  }
