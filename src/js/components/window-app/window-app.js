/**
 * The window-app web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>

    /* Style for the window app container */
    .window-app {
      position: absolute;
      display: flex;
      flex-direction: column;
      width: 500px;
      height: 400px;
      border: 5px solid pink;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.5);
      top: 200px;
      left: 200px;
    }
    
    /* Style for the window app header */
    .window-app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      background: pink;
      padding: 0;
      box-sizing: border-box;
    }

    /* Style for the window app close button */
    .window-app-close {
      width: 20px;
      height: 20px;
      cursor: pointer;
      background: url('/img/close-icon.png') center/contain no-repeat;
    }
    
    /* Style for the window app content */
    .window-app-content {
      flex: 1;
      overflow: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      background: black;
    }

    .window-app-content::-webkit-scrollbar {
      width: 12px; /* Width of the scrollbar */
     background-color: rgb(40, 40, 46); /* Color of the scrollbar */
    }

    .window-app-content::-webkit-scrollbar-thumb {
      background-color: white ; /* Color of the thumb (the part that you drag) */
    }
    
    ::slotted(memory-app) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
    }

  </style>

  <div class="window-app">
    <div class="window-app-header">
      <div class="window-app-close"></div>
    </div>
    <div class="window-app-content">
      <!-- Other web components can go here -->
      <slot></slot>
    </div>
  </div>
`

/**
 * Define a custom element.
 */
customElements.define('window-app',

  /**
   * Represents a window-app element.
   */
  class extends HTMLElement {
    #windowAppHeader

    #windowApp

    #closeButton

    static highestIndex = 0

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Query selectos
      this.#windowAppHeader = this.shadowRoot.querySelector('.window-app-header')
      this.#windowApp = this.shadowRoot.querySelector('.window-app')
      this.#closeButton = this.shadowRoot.querySelector('.window-app-close')

      // Flag that indicates whether the element is currently being dragged
      this.isDragging = false

      // Initial position of the element when the drag starts
      this.initialX = 0
      this.initialY = 0

      // Current position of the element
      this.currentX = 0
      this.currentY = 0

      // Offset from the initial position
      this.xOffset = 0
      this.yOffset = 0

      // Event listeners
      // Event listener for the mouse being down on window header
      this.#windowAppHeader.addEventListener('mousedown', (event) => {
        this.#handleMouseDown(event)
      })

      // Event listener for mouse up on window header
      this.#windowAppHeader.addEventListener('mouseup', (event) => {
        this.#handleMouseUp(event)
      })

      // Event listener for the mouse moving inside the browser window
      window.addEventListener('mousemove', (event) => {
        this.#handleMouseMove(event)
      })

      // Close button event listerners
      this.#closeButton.addEventListener('click', (event) => {
        this.remove()
      })
    }

    /**
     * Used when the element is added to the DOM. Set the attribute active on clicked window, so it can be placed on top of the other applications (higher z index).
     */
    connectedCallback () {
      this.#appFocus()
    }

    /**
     * Event listener method, that is called when the user starts dragging the window app. Sets the initial position and flags the element as being dragged.
     *
     * @param {object} event - the event object.
     */
    #handleMouseDown (event) {
      // offsetLeft/offsetTop - number of pixels offset from the parent element
      this.initialX = this.#windowApp.offsetLeft
      this.initialY = this.#windowApp.offsetTop

      // client x/y - the mouse coordinates on the x and y axis
      this.xOffset = event.clientX - this.#windowApp.offsetLeft
      this.yOffset = event.clientY - this.#windowApp.offsetTop

      this.isDragging = true
    }

    /**
     * Event listener method, that is called when the user releases the mouse button. Resets the initial position and flags the element as not being dragged.
     *
     * @param {object} event - the event object.
     */
    #handleMouseUp (event) {
      this.isDragging = false
    }

    /**
     * Event listener method, that is called when the user moves the mouse while dragging the element. Updates the position of the element based on the mouse movement.
     *
     * @param {object} event - the event object.
     */
    #handleMouseMove (event) {
      if (this.isDragging) {
        event.preventDefault()

        //  Calculate the current position of the window app based on the distance the mouse has moved from the initial position
        this.currentX = event.clientX - this.xOffset
        this.currentY = event.clientY - this.yOffset

        // Constrain the window app within the browser window
        // if the current x position of window app < maximum allow position (0 for the edge of the browser)
        if (this.currentX < 0) {
          this.currentX = 0
        }

        // if the current x position of window app > maximum allow position (width of browser - width of window app)
        if (this.currentX > window.innerWidth - this.#windowApp.offsetWidth) {
          this.currentX = window.innerWidth - this.#windowApp.offsetWidth
        }

        // same behaviour for y
        if (this.currentY < 0) {
          this.currentY = 0
        }
        if (this.currentY > window.innerHeight - this.#windowApp.offsetHeight) {
          this.currentY = window.innerHeight - this.#windowApp.offsetHeight
        }

        // Set the new position of the window app with style.left and style.top
        this.#windowApp.style.left = `${this.currentX}px`
        this.#windowApp.style.top = `${this.currentY}px`
      }
    }

    /**
     * Set the app to be in focus.
     */
    #appFocus () {
      this.addEventListener('click', (event) => {
        this.setAttribute('active', '')
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['active']
    }

    /**
     * Called when observed attribute changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The attribute's old value.
     * @param {string} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'active' && newValue !== null) {
        // use constructor to access the static property in the class
        this.#windowApp.style.zIndex = this.constructor.highestIndex++
      }
    }
  }
)
