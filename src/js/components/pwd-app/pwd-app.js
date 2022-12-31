/**
 * The pwd-app web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      user-select: none;
    }

    h1 {
      color: pink;
    }

    window-app {
      position: absolute;
      top: 0;
      left: 0;
    }

    #message {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-top: 10%;
    }
    
    #taskbar {
        display: flex;
        gap: 10px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: pink;
        height: 40px;
        width: 100%;
    }

    #app1 {
        background-image: url('/img/messages-app.png');
        background-size: 100%;
    }

    #app2 {
        background-image: url('/img/cooking-app.png');
        background-size: 100%;
    }

    #app3 {
        background-image: url('/img/memory-app.png');

        background-size: 100%;
    }

    .app-icon {
        background: rgb(40, 40, 46);
        margin: 3px 3px 3px 3px;
        padding: 2px 2px 0px 2px;   
        height: 32px;
        width: 32px;
    }
</style>
    <div id ="message">
        <h1>Welcome to the Web Cafe</h1>
        <h3>Choose your activity</h3>
    </div>
    <div id="taskbar">
       <div id="app1" class="app-icon"></div>
       <div id="app2" class="app-icon"></div>
       <div id="app3" class="app-icon"></div>
    </div>

`

customElements.define('pwd-app',

    class extends HTMLElement {

        #desktop

        #taskbar

        #messsagesApp

        #myCookbook

        #memoryApp

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            this.#desktop = this.shadowRoot.querySelector('#desktop')
            this.#taskbar = this.shadowRoot.querySelector('#taskbar')
            this.#messsagesApp = this.shadowRoot.querySelector('#app1')
            this.#myCookbook = this.shadowRoot.querySelector('#app2')
            this.#memoryApp = this.shadowRoot.querySelector('#app3')

            // event listeners
            // closing the application event listener
            this.addEventListener('closeApp', (event))
        }

        /**
         * Used when the element is added to the DOM.
         */
        connectedCallback() {
            this.#messsagesApp.addEventListener('click', () => this.createApp('window-app', 'messages-app'))
            this.#myCookbook.addEventListener('click', () => this.createApp('window-app', 'my-cookbook'))
            this.#memoryApp.addEventListener('click', () => this.createApp('window-app', 'memory-app'))
        }

        /**
         * Method that opens the apps by creating them.
         * @param {*} window 
         * @param {*} app 
         */
        createApp(window, app) {
            const win = document.createElement(window)
            const application = document.createElement(app)
            win.appendChild(application)
            this.shadowRoot.appendChild(win)
        }
    }
)