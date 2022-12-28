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

    h1 {
      color: pink;
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
    <h3>Select game difficulty</h3>
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
        this.#createTiles(2, 2)
      })

      this.#fourbytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#createTiles(4, 2)
      })

      this.#fourbyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#createTiles(4, 4)
      })
    }

    #createTiles(numberOfColumns, numberOfRows) {
      // create an array of tiles
      const tiles = []
      for (let i = 0; i < numberOfColumns * numberOfRows; i++) {
        const tile = document.createElement('memory-tile')
        const imgSlot = this.#createSlottedImages()
        tile.appendChild(imgSlot)
        tiles.push(tile)
      }

      for (let i = 0; i < numberOfColumns * numberOfRows; i += numberOfColumns) {
        const row = document.createElement('div')
        for (let j = 0; j < numberOfColumns; j++) {
          row.appendChild(tiles[i + j])
        }
        this.#game.appendChild(row)
      }
    }

    /**
     * Get a random image from an array of images
     */
    #getRandomImage() {
      const images = ['/img/cake.png', '/img/sundae.png', '/img/sushi.png', '/img/boba.png', '/img/pizza.png', '/img/hotdog.png', '/img/icecream.png', '/img/coffee.png']
      const randomIndex = Math.floor(Math.random() * images.length)
      const randomImage = images[randomIndex]
      return randomImage
    }
    /**
     * Get an array of two slotted images, one the original and one a clone.
     * 
     * @returns 
     */
    #createSlottedImages() {

      const imgSlot = document.createElement('img')
      const source = this.#getRandomImage()
      imgSlot.setAttribute('src', source)
      return imgSlot
    }
  }
)
