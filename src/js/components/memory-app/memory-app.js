/**
 * The memory-app web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

import '../memory-tile/index.js'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
        display:none;
    }

    p:hover {
      color: pink;
      cursor: pointer;
    }

     .options {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

  </style>
  <div class="options">
    <h1>Memory game</h1>
    <h3>Select game mode</h3>
      <p id="twobytwo">2x2</p>
      <p id="fourbytwo">4x2</p>
      <p id="fourbyfour">4x4</p>
  </div>

  <div class="game" class="hidden">
  </div>
  
`

customElements.define('memory-app',
  /**
   * Represents a flipping tile.
   */
  class extends HTMLElement {
    #options

    #game

    #twobytwo

    #fourbytwo

    #fourbyfour

    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the tile element in the shadow root.
      this.#options = this.shadowRoot.querySelector('.options')
      this.#game = this.shadowRoot.querySelector('.game')
      this.#twobytwo = this.shadowRoot.querySelector('#twobytwo')
      this.#fourbytwo = this.shadowRoot.querySelector('#fourbytwo')
      this.#fourbyfour = this.shadowRoot.querySelector('#fourbyfour')

      // Listen to click events.
      this.#twobytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#twoByTwo()
      })

      this.#fourbytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#fourByTwo()
      })

      this.#fourbyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#fourByFour()
      })
    }

    #twoByTwo() {
      // Create an array of tiles
      const tiles = []
      for (let i = 0; i < 4; i++) {
        const tile = document.createElement('memory-tile');
        tiles.push(tile)
      }

      // Append the tiles to the game container, two tiles per row
      for (let i = 0; i < 4; i++) {
        const row = document.createElement('div')
        row.appendChild(tiles[i])
        if (i % 2 !== 0) {
          row.appendChild(tiles[i - 1])
        }
        this.#game.appendChild(row)
      }
    }

    #fourByTwo() {
      const tiles = []
      for (let i = 0; i < 8; i++) {
        const tile = document.createElement('memory-tile')
        tiles.push(tile)
      }
      // four tiles per two rows
      for (let i = 0; i < 8; i += 4) {
        const row = document.createElement('div')
        row.appendChild(tiles[i])
        row.appendChild(tiles[i + 1])
        row.appendChild(tiles[i + 2])
        row.appendChild(tiles[i + 3])
        this.#game.appendChild(row)
      }
    }

    #fourByFour () {
      const tiles = []
      for (let i = 0; i < 16; i++) {
        const tile = document.createElement('memory-tile')
        tiles.push(tile)
      }

      // four tiles per four rows
      for (let i = 0; i < 16; i+=4) {
        const row = document.createElement('div')
        row.appendChild(tiles[i])
        row.appendChild(tiles[i + 1])
        row.appendChild(tiles[i + 2])
        row.appendChild(tiles[i + 3])
        this.#game.appendChild(row)
      }
    }


  }
)
