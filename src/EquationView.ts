import { DOMSerializer, Node as PMNode } from 'prosemirror-model'
import { Decoration, DecorationSource, EditorView, NodeView } from 'prosemirror-view'
import { NodeSelection } from 'prosemirror-state'
import { EditorView as CodeMirrorView, placeholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import katex from 'katex'

import { PopperProvider } from './PopperProvider'

export class EquationView implements NodeView {
  protected _dom?: HTMLElement
  contentDOM?: HTMLElement
  node: PMNode

  codemirror?: CodeMirrorView
  popper: PopperProvider
  view: EditorView

  constructor(
    node: PMNode,
    view: EditorView,
    readonly getPos: () => number,
    _decorations: readonly Decoration[],
    _innerDecorations: DecorationSource,
    popper: PopperProvider
  ) {
    this.node = node
    this.view = view
    this.popper = popper
    return this
  }

  get dom() {
    if (!this._dom) {
      throw Error('Accessing uninitialized dom! Check your "init" method')
    }
    return this._dom
  }

  init = () => {
    const toDOM = this.node.type.spec.toDOM
    if (toDOM) {
      const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node))
      this._dom = dom as HTMLElement
      this.contentDOM = contentDOM
    }
    this.updateContents()
    return this
  }

  update = (
    newNode: PMNode,
    _decorations: readonly Decoration[],
    _innerDecorations: DecorationSource
  ): boolean => {
    // if (!newNode.sameMarkup(this.node)) return false
    if (newNode.attrs.id !== this.node.attrs.id) {
      return false
    }
    if (newNode.type.name !== this.node.type.name) {
      return false
    }
    this.node = newNode
    this.updateContents()
    return true
  }

  updateContents = () => {
    console.log('updateContents')
    const { TeXRepresentation } = this.node.attrs
    if (TeXRepresentation) {
      katex.render(TeXRepresentation, this.dom, {
        throwOnError: false,
      })
    } else {
      // const placeholder = document.createElement('div')
      // placeholder.className = 'equation-placeholder'
      // placeholder.textContent = '<Equation>'
      // this.dom.appendChild(placeholder)
    }
  }

  handleCodeMirrorChange = (v: import('@codemirror/view').ViewUpdate) => {
    if (!v.docChanged) {
      return
    }
    const TeXRepresentation = v.view.state.doc.toJSON().join('')
    const { tr } = this.view.state
    const pos = this.getPos()

    tr.setNodeMarkup(pos, undefined, {
      ...this.node.attrs,
      TeXRepresentation,
    })
      .setSelection(NodeSelection.create(tr.doc, pos))
      .scrollIntoView()
    // tr.scrollIntoView()
    this.view.dispatch(tr)
  }

  selectNode = async () => {
    const { EditorView: CodeMirrorView } = await import('@codemirror/view')
    if (!this.codemirror) {
      this.codemirror = new CodeMirrorView({
        doc: this.node.attrs.TeXRepresentation,
        state: EditorState.create({
          extensions: [
            placeholder('Enter LaTeX equation, e.g. "a^2 = \\sqrt{b^2 + c^2}"'),
            CodeMirrorView.updateListener.of(this.handleCodeMirrorChange),
          ],
        }),
      })
      const wrapper = document.createElement('div')
      wrapper.appendChild(this.codemirror.dom)
      wrapper.className = 'equation-editor'

      const infoLink = document.createElement('a')
      infoLink.target = '_blank'
      infoLink.textContent = '?'
      infoLink.title = ''
      infoLink.href = 'https://en.wikibooks.org/wiki/LaTeX/Mathematics#Symbols'
      infoLink.className = 'equation-editor-info'

      wrapper.appendChild(infoLink)

      this.popper.open(this.dom, wrapper, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      })

      window.requestAnimationFrame(() => {
        // codemirror.refresh()
        this.codemirror?.focus()
      })
    } else {
    }
    console.log('selectNode', this.codemirror)
    this.dom.classList.add('ProseMirror-selectednode')
  }

  deselectNode = () => {
    console.log('deselectNode')
    this.dom.classList.remove('ProseMirror-selectednode')
    this.popper.close()
    this.codemirror?.destroy()
    this.codemirror = undefined
  }

  destroy = () => {
    console.log('destroy')
    this.popper.close()
    this.codemirror?.destroy()
    this.codemirror = undefined
  }

  ignoreMutation = () => true

  static fromComponent(popper: PopperProvider) {
    return (
      node: PMNode,
      view: EditorView,
      getPos: () => number,
      decorations: readonly Decoration[],
      innerDecorations: DecorationSource
    ) => new this(node, view, getPos, decorations, innerDecorations, popper).init()
  }
}
