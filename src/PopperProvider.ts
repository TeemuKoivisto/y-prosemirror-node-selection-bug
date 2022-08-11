import { createPopper } from '@popperjs/core'
import type { Instance, OptionsGeneric, Modifier } from '@popperjs/core'

export class PopperProvider {
  #openPopper?: Instance
  #el: HTMLElement

  constructor() {
    this.#el = document.createElement('div')
    this.#el.classList.add('popper')
    document.body.appendChild(this.#el)
  }

  open(
    target: HTMLElement,
    content: HTMLElement,
    opts?: Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
  ) {
    this.close()
    this.#el.appendChild(content)
    this.#el.setAttribute('data-show', '')
    this.#openPopper = createPopper(target, this.#el, opts)
  }

  update() {
    if (this.#openPopper) {
      this.#openPopper.update()
    }
  }

  close() {
    if (this.#openPopper) {
      console.log('close popper')
      while (this.#el.hasChildNodes()) {
        this.#el.removeChild(this.#el.firstChild as ChildNode)
      }
      this.#el.removeAttribute('data-show')
      this.#openPopper.destroy()
      this.#openPopper = undefined
    }
  }
}
