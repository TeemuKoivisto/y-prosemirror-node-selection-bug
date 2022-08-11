import { Node as PMNode, Schema } from 'prosemirror-model'

// From https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },
    text: {
      group: 'inline',
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      },
    },
    placeholder: {
      atom: true,
      selectable: false,
      attrs: {
        id: { default: '' },
        label: { default: '' },
        dataTracked: { default: null },
      },
      group: 'block',
      parseDOM: [
        {
          tag: 'div.placeholder',
          getAttrs: (dom: HTMLElement | string) => {
            if (dom instanceof HTMLElement) {
              return {
                id: dom.getAttribute('id'),
                label: dom.getAttribute('label'),
              }
            }
            return null
          },
        },
      ],
      toDOM: (node: PMNode) => {
        return [
          'div',
          {
            class: 'placeholder-item',
            id: node.attrs.id,
          },
        ]
      },
    },
    figcaption: {
      content: 'inline*',
      group: 'block',
      attrs: { dataTracked: { default: null } },
      isolating: true,
      selectable: false,
      parseDOM: [
        {
          tag: 'figcaption',
        },
      ],
      toDOM: () => ['figcaption', 0],
    },
    equation_wrapper: {
      content: '(equation | placeholder) figcaption',
      attrs: {
        id: { default: '' },
        class: { default: 'equation-wrapper' },
        suppressCaption: { default: true },
        suppressTitle: { default: undefined },
        dataTracked: { default: null },
      },
      selectable: false,
      group: 'block element',
      parseDOM: [
        {
          tag: 'figure.equation-wrapper',
          getAttrs: (dom: HTMLElement | string) => {
            if (dom instanceof HTMLElement) {
              return {
                id: dom.getAttribute('id'),
              }
            }
            return null
          },
        },
      ],
      toDOM: (node: PMNode) => {
        const attrs = {
          id: node.attrs.id,
          class: node.attrs.class,
        }
        return ['figure', attrs, 0]
      },
    },
    equation: {
      attrs: {
        id: { default: '' },
        class: { default: 'equation' },
        TeXRepresentation: { default: '' },
        dataTracked: { default: null },
      },
      group: 'block',
      parseDOM: [
        {
          tag: `div.equation`,
          getAttrs: (dom: HTMLElement | string) => {
            if (dom instanceof HTMLElement) {
              return {
                id: dom.getAttribute('id'),
                TeXRepresentation: dom.getAttribute('data-tex-representation'),
              }
            }
            return null
          },
        },
      ],
      toDOM: (node: PMNode) => {
        const attrs = {
          id: node.attrs.id,
          class: node.attrs.class,
          'data-tex-representation': node.attrs.TeXRepresentation,
        }
        return ['div', attrs]
      },
    },
  },
})
