import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import * as Y from 'yjs'
import { ySyncPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'

import { schema } from '../../schema'
import { main } from '../../app'

const ydoc = new Y.Doc()
const permanentUserData = new Y.PermanentUserData(ydoc)
const yXmlFragment = ydoc.getXmlFragment('pm-doc')

main(exampleSetup({ schema, history: false }).concat([
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
]))
