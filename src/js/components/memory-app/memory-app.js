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

    #game-easy {
      display: grid;
      grid-template-columns: repeat(2, var(--tile-size));   
      gap: 8px;
    }

    #game-medium {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));  
      grid-template-rows: repeat(2, var(--tile-size)); 
      gap: 8px;
    }
   
    #game-hard {
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
      <p id="twobyfour">2x4</p>
      <p id="fourbyfour">4x4</p>
  </div>

  <div class="game" class="hidden" >
  </div>
  <div id="end-message" class="hidden">
    <h4></h4>
    <button>Play again</button>
  </div>  
`

/**
 * Define custom element.
 */
customElements.define('memory-app',
  /**
   * Represents a the memory-app element.
   */
  class extends HTMLElement {
    /**
     * The start screen div including the options to play the game.
     *
     * @type {HTMLDivElement}
     */
    #options

    /**
     * The game instance.
     *
     * @type {HTMLDivElement}
     */
    #game

    /**
     * The choice for creating a 2 x 2 game grid.
     *
     * @type {HTMLParagraphElement}
     */
    #twobytwo

    /**
     * The choice for creating a 2 x 4 game grid.
     *
     * @type {HTMLParagraphElement}
     */
    #twobyfour

    /**
     * The choice for creating a 4 x 4 game grid.
     *
     * @type {HTMLParagraphElement}
     */
    #fourbyfour

    /**
     * The array of images to be used in the game.
     *
     * @type {Array}
     */
    #images = ['/img/cake.png', '/img/sundae.png', '/img/sushi.png', '/img/boba.png', '/img/pizza.png', '/img/hotdog.png', '/img/icecream.png', '/img/coffee.png']

    /**
     * The tiles created by using the memory-tile web component.
     *
     * @type {HTMLElement}
     */
    #tiles

    /**
     * The number of matches it took for the user to match all the pairs.
     *
     * @type {number}
     */
    #numberOfMatches = 0

    /**
     * The end message displayed after the user wins the game.
     *
     * @type {HTMLDivElement}
     */
    #endMessage

    /**
     * The play again button displayed after the user wins the game.
     *
     * @type {HTMLButtonElement}
     */
    #playAgainButton

    /**
     * The start time of the game.
     *
     * @type {number}
     */
    #startTime

    /**
     * The end time of the game.
     *
     * @type {number}
     */
    #endTime

    /**
     * How long did it take for a user to complete the game.
     *
     * @type {number}
     */
    #totalTime

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Query selectors
      this.#options = this.shadowRoot.querySelector('.options')
      this.#game = this.shadowRoot.querySelector('.game')
      this.#twobytwo = this.shadowRoot.querySelector('#twobytwo')
      this.#twobyfour = this.shadowRoot.querySelector('#twobyfour')
      this.#fourbyfour = this.shadowRoot.querySelector('#fourbyfour')
      this.#tiles = this.shadowRoot.querySelectorAll('memory-tile')
      this.#endMessage = this.shadowRoot.querySelector('#end-message')
      this.#playAgainButton = this.shadowRoot.querySelector('button')

      // Event listeners
      // Listen to click events
      this.#twobytwo.addEventListener('click', (event) => {
        event.preventDefault()
        this.#gameInitialize(2, 2, 'game-easy')
      })

      this.#twobyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#gameInitialize(2, 4, 'game-medium')
      })

      this.#fourbyfour.addEventListener('click', (event) => {
        event.preventDefault()
        this.#gameInitialize(4, 4, 'game-hard')
      })

      // Game over event listener
      this.addEventListener('memory-game:game-over', () => {
        this.#endMessage.removeAttribute('class', 'hidden')
        this.#game.setAttribute('class', 'hidden')
        this.#game.removeAttribute('id', '')
        this.#endTime = Date.now()
        this.#totalTime = (Math.round((this.#endTime - this.#startTime) / 1000))
        this.#endMessage.querySelector('h4').textContent = `You win! It took you ${this.#totalTime} seconds and ${this.#numberOfMatches} attempts.`
        this.#clickButton()
      })

      // Listens to the flip event, thereafter calling the #gameLogic method.
      this.#game.addEventListener('memory-tile:flip', () => this.#gameLogic())
    }

    /**
     * Event on clicking the play again button after finishing a game. Hide or show relevant parts of the component, reset the innerHTML of the game, reset the matching of the tiles to 0 and the images to the orriginal array.
     */
    #clickButton () {
      this.#playAgainButton.addEventListener('click', () => {
        this.#options.removeAttribute('class', 'hidden')
        this.#options.setAttribute('class', 'options')
        this.#endMessage.setAttribute('class', 'hidden')
        this.#game.innerHTML = ''
        this.#numberOfMatches = 0
        this.#images = ['/img/cake.png', '/img/sundae.png', '/img/sushi.png', '/img/boba.png', '/img/pizza.png', '/img/hotdog.png', '/img/icecream.png', '/img/coffee.png']
      })
    }

    /**
     * Getter used get all the tiles.
     *
     * @returns {object} - an object containing tiles with specific attributes.
     */
    get tiles () {
      const tiles = Array.from(this.#tiles)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Set the rules for the game. When two tiles match (are the same node) they get the attribute hidden. If the tiles don't match they get flipped back around. Only who tiles may be flipped at the same time, the others are disabled while the matching occurs.
     */
    #gameLogic () {
      const tiles = this.tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        window.setTimeout(() => {
          if (first.isEqualNode(second)) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            this.#numberOfMatches++
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
            this.#numberOfMatches++
          }

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('memory-game:game-over'))
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, 1500)
      }
    }

    /**
     * Create game tiles according to the number of rows and columns.
     *
     * @param {number} numberOfRows - the number of rows.
     * @param {number} numberOfColumns - the number of columns.
     */
    #createTiles (numberOfRows, numberOfColumns) {
      // Create an array of tiles.
      this.#tiles = []

      // Generate as many tiles as needed.
      for (let i = 0; i < (numberOfColumns * numberOfRows) / 2; i++) {
        const tile = document.createElement('memory-tile')
        const imgSlot = this.#createSlottedImage()
        tile.appendChild(imgSlot)
        const clonedTile = tile.cloneNode(true)
        this.#tiles.push(tile)
        this.#tiles.push(clonedTile)
      }

      // Create columns out of the tiles, append tiles to them and then append them to the game.
      for (let i = 0; i < numberOfColumns * numberOfRows; i += numberOfRows) {
        const column = document.createElement('div')
        for (let j = 0; j < numberOfRows; j++) {
          column.appendChild(this.#tiles[i + j])
        }
        this.#game.appendChild(column)
      }
    }

    /**
     * Get a random image URL string from an array of images. The image is different everytime.
     *
     * @returns {string} - an URL string of a random image.
     */
    #getRandomImage () {
      const randomIndex = Math.floor(Math.random() * this.#images.length)
      const randomImage = this.#images[randomIndex]
      this.#images.splice(randomIndex, 1)
      return randomImage
    }

    /**
     * Create a slotted image with the img source from the #getRandomImage method.
     *
     * @returns {HTMLImageElement} - the slotted image.
     */
    #createSlottedImage () {
      const imgSlot = document.createElement('img')
      const source = this.#getRandomImage()
      imgSlot.setAttribute('src', source)
      return imgSlot
    }

    /**
     * Method that shuffles the images by shuffling the src attributes around.
     */
    #shuffleImages () {
      this.#tiles = this.#game.querySelectorAll('memory-tile')
      const srcs = []

      // Get all the src attributes and push them into an array.
      for (const tile of this.#tiles) {
        const img = tile.firstChild
        const src = img.getAttribute('src')
        srcs.push(src)
      }

      // Shuffle the srcs in the array using the #shuffleArray method.
      const shuffledScrs = this.#shuffleArray(srcs)

      // Set the attribute src to the srcs from the shuffled array of srcs. Start with index 0 and increment the index until there are no more srcs.
      let index = 0
      for (const tile of this.#tiles) {
        const img = tile.firstChild
        img.setAttribute('src', shuffledScrs[index])
        img.setAttribute('alt', shuffledScrs[index].slice(5, shuffledScrs[index].length - 4))
        index++
      }
    }

    /**
     * Shuffle an array with the Fisher-Yates algorithm.
     *
     * @param {Array} array - an array.
     * @returns {Array} - the shuffled array.
     */
    #shuffleArray (array) {
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    }

    /**
     * Initialize the game for every option.
     *
     * @param {number} numberOfRows - the number of rows.
     * @param {number} numberOfColumns - the number of columns.
     * @param {string} id - the id of the game difficulty chosen.
     */
    #gameInitialize (numberOfRows, numberOfColumns, id) {
      this.#options.setAttribute('class', 'hidden')
      this.#game.removeAttribute('class', 'hidden')
      this.#game.setAttribute('id', id)
      this.#createTiles(numberOfRows, numberOfColumns)
      this.#shuffleImages()
      this.#gameLogic()
      this.#startTime = Date.now()
    }
  }
)
