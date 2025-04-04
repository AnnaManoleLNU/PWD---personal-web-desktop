/**
 * The memory-tile web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
        display: block;
        height: 87px;
        width: 80px;
        perspective: 1000px;
        position: relative;
    }
    
    :host([face-up]) #front {
      display: inline-block;
    }

    :host([face-up]) #back {
      display: none;
    }
    
    :host([hidden]) #tile {
        cursor: default;
        pointer-events: none;
        box-shadow: none;
        visibility: hidden;
    }

    /* To remove? Not important */
    :host([hidden]) #tile>* {
        visibility: hidden;
    }

    /* flipping */
    :host([face-up]) #tile {
      transform: rotateY(180deg);
    }

    #tile {
      display: inline;
      height: 85px;
      width: 80px;
      padding:0;
      border: solid 1px #767676;
      border-radius: 10px;
      outline: none;
      background-color: #fff;
      cursor: pointer;
      box-shadow: 0px 0 10px #ccc;
      /* flipping */
      transform-style: preserve-3d;
    }

    #tile[disabled] {
      cursor: default;
      pointer-events: none;
      box-shadow: none;
      border-color: #858585;
    }

    #tile:focus {
      outline: 2px solid pink;
    }

    #front,
    #back {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: 8px;
      margin:2px;
      /* flipping */
      position: absolute;
      top:0;
      left:0;
      backface-visibility: hidden;
    }

    #front {
      background-color:#fff;
      /* flipping */
      transform: rotateY(180deg);
    }

    #back {
      background-color:pink;
    }

    slot {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
 
    /* Styles slotted images.  */
    ::slotted(img) {
        max-width: 80%;
        max-height: 80%;
    }

  </style>

    <button id="tile">
      <div id="front">
        <slot></slot>
      </div>
      <div id="back"></div>
    </button>
`
/**
 * Define custom element.
 */
customElements.define('memory-tile',
  /**
   * Represents a memory-tile element.
   */
  class extends HTMLElement {
    /**
     * The element representing the tile.
     *
     * @type {HTMLElement}
     */
    #tile

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the tile element in the shadow root.
      this.#tile = this.shadowRoot.querySelector('#tile')

      // Listen to click events.
      this.addEventListener('click', (event) => {
        // Flip if main button (left-click).
        if (event.button === 0) {
          this.#flip()
        }
      })

      // Listen to keydown events.
      this.addEventListener('keydown', (event) => {
        // Flip if Enter or Space key pressed.
        if (event.key === 'Enter' || event.key === ' ') {
          this.#flip()
        }
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      // Enable or disable the button inside the shadow DOM.
      if ((name === 'disabled' || name === 'hidden') &&
        oldValue !== newValue) {
        // Determine if the disabled attribute should be present or absent.
        const isPresent = Boolean(newValue) || newValue === ''

        if (isPresent) {
          this.#tile.setAttribute('disabled', '')
          this.blur()
        } else {
          this.#tile.removeAttribute('disabled')
        }
      }
    }

    /**
     * Flips the current instance, if it is not disabled.
     */
    #flip () {
      // Do not do anything if the element is disabled or hidden.
      if (this.hasAttribute('disabled') ||
        this.hasAttribute('hidden')) {
        return
      }

      // Toggle the face-up attribute.
      this.hasAttribute('face-up')
        ? this.removeAttribute('face-up')
        : this.setAttribute('face-up', '')

      // Raise the my-flipping-tile-extra:flip event.
      this.dispatchEvent(new CustomEvent('memory-tile:flip', { bubbles: true }))
    }
  }
)
