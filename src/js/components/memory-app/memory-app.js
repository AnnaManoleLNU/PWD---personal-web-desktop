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
    :host {
          --tile-size: 85px;
        }

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
      height: 100%;
    }

    button {
        background-color: pink;
        border-radius: 10px;        
        padding: 3px 10px 3px 10px;
    }

    #game {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));   
      gap: 8px;
    }

    memory-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }

  </style>
  <div class="options">
    <h1>Memory game</h1>
    <h3>Select game difficulty</h3>
      <p id="twobytwo">2x2</p>
      <p id="fourbytwo">4x2</p>
      <p id="fourbyfour">4x4</p>
  </div>

  <div id="game" class="hidden" >
  </div>
  <div id="end-message" class="hidden">
    <h4></h4>
    <button>Play again</button>
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

    #imagesCopy

    #tiles

    #tile

    #numberOfMatches = 0

    #endMessage

    #startTime

    #endTime

    #totalTime

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
      this.#game = this.shadowRoot.querySelector('#game')
      this.#twobytwo = this.shadowRoot.querySelector('#twobytwo')
      this.#fourbytwo = this.shadowRoot.querySelector('#fourbytwo')
      this.#fourbyfour = this.shadowRoot.querySelector('#fourbyfour')
      this.#tiles = this.shadowRoot.querySelectorAll('memory-tile')
      this.#endMessage = this.shadowRoot.querySelector('#end-message')

      // Listen to click events.
      this.#twobytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('class', 'hidden')
        this.#createTiles(2, 2)
        this.#shuffleImages()
        this.#gameLogic()
        this.#startTime = Date.now()
      })

      this.#fourbytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('class', 'hidden')
        this.#createTiles(4, 2)
        this.#shuffleImages()
        this.#gameLogic()
        this.#startTime = Date.now()
      })

      this.#fourbyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#options.setAttribute('class', 'hidden')
        this.#game.removeAttribute('class', 'hidden')

        this.#createTiles(4, 4)
        this.#shuffleImages()
        this.#gameLogic()
        this.#startTime = Date.now()
      })

      // Game over
      this.addEventListener('memory-game:game-over', () => {
        this.#endMessage.removeAttribute('class', 'hidden')
        this.#game.setAttribute('class', 'hidden')
        this.#endTime = Date.now()
        this.#totalTime = (Math.round((this.#endTime - this.#startTime) / 1000))
        this.#endMessage.querySelector('h4').textContent = `You win! It took you ${this.#totalTime} seconds and ${this.#numberOfMatches} attempts.`
        this.#clickButton()        
      })

    } // CONSTRUCTOR END  

    connectedCallback() {
      this.#game.addEventListener('flip', () => this.#gameLogic())
    }

    /**
     * Event on clicking the button.
     */
    #clickButton() {
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        this.#options.removeAttribute('class', 'hidden')
        this.#options.setAttribute('class', 'options')
        this.#endMessage.setAttribute('class', 'hidden')
        this.#game.innerHTML = ''
        this.#numberOfMatches = 0
        this.#images = ['/img/cake.png', '/img/sundae.png', '/img/sushi.png', '/img/boba.png', '/img/pizza.png', '/img/hotdog.png', '/img/icecream.png', '/img/coffee.png']
      })
    }

    /**
     * Getter.
     */
    get tiles() {
      const tiles = Array.from(this.#tiles)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Set the rules for the game.
     */
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
          if (first.isEqualNode(second)) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
            this.#numberOfMatches++
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
            this.#numberOfMatches++
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

    /**
     * Create game tiles according to the number of columns and rows.
     *
     * @param {*} numberOfColumns 
     * @param {*} numberOfRows 
     */
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
     * Get a random image from an array of images. A different one everytime.
     */
    #getRandomImage() {
      const randomIndex = Math.floor(Math.random() * this.#images.length)
      const randomImage = this.#images[randomIndex]
      this.#images.splice(randomIndex, 1)
      return randomImage
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

    /**
     * Shuffle the src attributes around.
     */
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
