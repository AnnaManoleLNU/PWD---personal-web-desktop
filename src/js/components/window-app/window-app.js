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
      display: flex;
      flex-direction: column;
      width: 500px;
      height: 400px;
      border: 1px solid pink;
      border-radius: 5px;
      overflow: hidden;
    }

    /* Style for the window app header */
    .window-app-header {
      display: flex;
      align-items: center;
      height: 30px;
      background: pink;
      padding: 0 10px;
      box-sizing: border-box;
    }

    /* Style for the window app close button */
    .window-app-close {
      width: 20px;
      height: 20px;
      margin-left: 465px;
      cursor: pointer;
      background: url('/img/close-icon.png') center/contain no-repeat;
    }

    /* Style for the window app content */
    .window-app-content {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      box-sizing: border-box;
    }

    .window-app-content::-webkit-scrollbar {
     width: 12px; /* Width of the scrollbar */
     background-color: gray; /* Color of the scrollbar */
}

    .window-app-content::-webkit-scrollbar-thumb {
     background-color: white; /* Color of the thumb (the part that you drag) */
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
        #slot

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            // selectors
            this.#slot = this.shadowRoot.querySelector('slot')
            console.log(this.#slot)
        }


    }
)