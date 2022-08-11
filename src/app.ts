import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { applyDevTools } from 'prosemirror-dev-toolkit'

import * as commands from './commands'
import { schema } from './schema'
import { EquationView } from './EquationView'
import { PopperProvider } from './PopperProvider'

import docJson from './doc.json'
import './index.css'

export function main(plugins: Plugin[]) {
  const popper = new PopperProvider()
  const state = EditorState.create({
    schema,
    plugins,
  })
  const view = new EditorView(document.querySelector('#editor'), {
    state,
    nodeViews: {
      equation: EquationView.fromComponent(popper),
    },
  })
  
  applyDevTools(view)
  
  document.querySelector('#reset-btn')?.addEventListener('click', () => {
    const { dispatch, state } = view
    const { tr } = state
    const doc = state.schema.nodeFromJSON(docJson)
    tr.replaceWith(0, state.doc.nodeSize - 2, doc)
    dispatch(tr)
  })
  document.querySelector('#eq-btn')?.addEventListener('click', () => {
    commands.createEquation()(view.state, view.dispatch, view)
  })
}
