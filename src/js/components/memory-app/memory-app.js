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

    #images = ['/img/cake.png', '/img/sundae.png', '/img/sushi.png', '/img/boba.png', '/img/pizza.png', '/img/hotdog.png', '/img/icecream.png', '/img/coffee.png']

    #tiles

    #tile

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
      this.#tiles = this.shadowRoot.querySelectorAll('memory-tile')

      // Listen to click events.
      this.#twobytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#createTiles(2, 2)
        this.#shuffleImages()
        this.#gameLogic()
      })

      this.#fourbytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#createTiles(4, 2)
        this.#shuffleImages()
        this.#gameLogic()
      })

      this.#fourbyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('hidden')
        this.#createTiles(4, 4)
        this.#shuffleImages()
        this.#gameLogic()
      })

    } // CONSTRUCTOR END  

    connectedCallback() {
      this.#game.addEventListener('flip', () => this.#gameLogic())
    }

    get tiles() {
      const tiles = Array.from(this.#tiles)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    #gameLogic() {
      const tiles = this.tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        window.setTimeout(() => {
          let eventName = 'memory-game:tiles-mismatch'
          if ((first.lastElementChild.getAttribute('src') === second.lastElementChild.getAttribute('src'))) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('memory-game:game-over', {
              bubbles: true
            }))

          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, 1500)
      }
    }

    #createTiles(numberOfColumns, numberOfRows) {
      // create an array of tiles
      this.#tiles = []

      for (let i = 0; i < (numberOfColumns * numberOfRows) / 2; i++) {
        this.#tile = document.createElement('memory-tile')
        const imgSlot = this.#createSlottedImage()
        this.#tile.appendChild(imgSlot)
        const clonedTile = this.#tile.cloneNode(true)
        this.#tiles.push(this.#tile)
        this.#tiles.push(clonedTile)
      }

      for (let i = 0; i < numberOfColumns * numberOfRows; i += numberOfColumns) {
        const row = document.createElement('div')
        for (let j = 0; j < numberOfColumns; j++) {
          row.appendChild(this.#tiles[i + j])
        }

        this.#game.appendChild(row)
      }
    }

    /**
     * Get a random image from an array of images. When an image has been used it gets pushed into an array of used images.
     */
    #getRandomImage() {
      let randomIndex = Math.floor(Math.random() * this.#images.length)
      let randomImage = this.#images[randomIndex]
      this.#images.splice(randomIndex, 1)
      return randomImage

      // !!! REMEMBER that if you press play again it should reset the array of images
    }
    /**
     * Create a slotted image with the img source from #getRandomImage
     * 
     * @returns 
     */
    #createSlottedImage() {
      const imgSlot = document.createElement('img')
      const source = this.#getRandomImage()
      imgSlot.setAttribute('src', source)
      return imgSlot
    }

    #shuffleImages() {
      this.#tiles = this.#game.querySelectorAll('memory-tile')
      const srcs = []

      for (const tile of this.#tiles) {
        const img = tile.firstChild
        const src = img.getAttribute('src')
        srcs.push(src)
      }

      const shuffledScrs = this.#shuffleArray(srcs)

      let index = 0
      for (const tile of this.#tiles) {
        const img = tile.firstChild
        img.setAttribute('src', shuffledScrs[index])
        index++
      }

    }
    /**
     * Shuffle an array with the Fisher-Yates algorithm.
     *
     * @param {*} array 
     * @returns array
     */
    #shuffleArray(array) {
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    }
  }
)
