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
      box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.5);
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

customElements.define('window-app',

  class extends HTMLElement {

    #windowAppHeader

    #windowApp

    #closeButton

    static highestIndex = 0

    constructor() {
      super()

      this.appName

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // selectors
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

      // Initial position of the element on the screen
      this.initialTop = 0
      this.initialLeft = 0

      this.#drag()

      this.appFocus()


      this.#closeButton.addEventListener('click', (event) => {
        this.closeAppEvent()
      })
    } // CONSTRUCTOR END 


    // Event listener that is called when the user starts dragging the window app.
    // Sets the initial position and flags the element as being dragged.
    #handleMouseDown(event) {
      this.initialX = event.clientX - this.xOffset
      this.initialY = event.clientY - this.yOffset

      if (event.target === this.#windowAppHeader) {
        this.isDragging = true
        this.currentX = event.clientX
        this.currentY = event.clientY
      }
    }

    // Event listener that is called when the user releases the mouse button.
    // Resets the initial position and flags the element as not being dragged.
    #handleMouseUp() {
      this.initialX = this.currentX
      this.initialY = this.currentY

      this.isDragging = false
    }

    // event listener that is called when the user moves the mouse while dragging the element
    // update the position of the element based on the mouse movement
    #handleMouseMove(event) {
      if (this.isDragging) {
        event.preventDefault()
        this.xOffset = event.clientX - this.initialX
        this.yOffset = event.clientY - this.initialY

        // maximum and minimum values for the left and top styles
        const minTop = 0
        const maxTop = window.innerHeight - this.#windowApp.offsetHeight
        const minLeft = 0
        const maxLeft = window.innerWidth - this.#windowApp.offsetWidth

        // the element stays within the allowed area
        this.#windowApp.style.top = Math.min(Math.max(this.yOffset, minTop), maxTop) + 'px'
        this.#windowApp.style.left = Math.min(Math.max(this.xOffset, minLeft), maxLeft) + 'px'
      }
    }

    // mouse down, mouse up, and mouse move events on the window app header element
    #drag() {
      this.#windowAppHeader.addEventListener('mousedown', this.#handleMouseDown.bind(this))
      this.#windowAppHeader.addEventListener('mouseup', this.#handleMouseUp.bind(this))
      window.addEventListener('mousemove', this.#handleMouseMove.bind(this))
    }

    // close button event
    closeAppEvent() {
      this.#closeButton.dispatchEvent(new window.CustomEvent('closeApp', { bubbles: true }))
      this.remove()
    }

    appFocus() {
      this.addEventListener('click', (event) => {
        this.setAttribute('active', '')
      })
    }

    static get observedAttributes() {
      return ['active']
    }

    /**
    * Called when observed attribute(s) changes.
    *
    * @param {string} name - The attribute's name.
    * @param {*} oldValue - The old value.
    * @param {*} newValue - The new value.
    */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'active' && newValue !== null) {
        // use constructor to access the static property in the class
        this.#windowApp.style.zIndex = this.constructor.highestIndex++
      }
    }

  }
)