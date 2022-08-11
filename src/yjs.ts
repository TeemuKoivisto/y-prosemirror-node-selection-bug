import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { applyDevTools } from 'prosemirror-dev-toolkit'
import { keymap } from 'prosemirror-keymap'
import * as Y from 'yjs'
import { ySyncPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'

import * as commands from './commands'
import { schema } from './schema'
import { EquationView } from './EquationView'
import { PopperProvider } from './PopperProvider'

import docJson from './doc.json'
import './index.css'

const popper = new PopperProvider()
const ydoc = new Y.Doc()
const permanentUserData = new Y.PermanentUserData(ydoc)
const yXmlFragment = ydoc.getXmlFragment('pm-doc')
const state = EditorState.create({
  schema,
  plugins: exampleSetup({ schema, history: false }).concat([
    ySyncPlugin(yXmlFragment, {
      permanentUserData: permanentUserData,
      colors: [
        { light: '#ecd44433', dark: '#ecd444' },
        { light: '#ee635233', dark: '#ee6352' },
        { light: '#6eeb8333', dark: '#6eeb83' },
      ],
    }),
    yUndoPlugin(),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,
    }),
  ]),
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
