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
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: pink;
        height: 40px;
        width: 100%;
        z-index: 9999;
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
        <h1>Welcome to the Web Café</h1>
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

        #messagesApp

        #myCookbook

        #memoryApp

        #appName

        #appNames = []

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            this.#messagesApp = this.shadowRoot.querySelector('#app1')
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
            this.#messagesApp.addEventListener('click', (event) => {
                this.#createApp('window-app', 'messages-app', 'Messages')
            })
            this.#myCookbook.addEventListener('click', (event) => {
                this.#createApp('window-app', 'my-cookbook', 'Coobook')

            })
            this.#memoryApp.addEventListener('click', (event) => {
                this.#createApp('window-app', 'memory-app', 'Memory game')
            })
        }

        /**
         * Method that opens the apps by creating them. Whenever an app is created the attribute is set to active so that the app is on top.  Sets the name of the app by creating the respective element and appending it to the app header.
         *
         * @param {*} window 
         * @param {*} app 
         */
        #createApp(win, app, appName) {
            // Create the window and app and append the app inside the window
            const window = document.createElement(win)
            const application = document.createElement(app)
            window.appendChild(application)
            window.setAttribute('active', '')
            this.shadowRoot.appendChild(window)

            // Set the name
            const appNameContainer = document.createElement('div')
            const appNameParagraph = document.createElement('p')
            appNameParagraph.style.color = 'black'
            appNameParagraph.style.fontWeight = 'bold'
            appNameContainer.appendChild(appNameParagraph)
            appNameParagraph.textContent = appName
            const header = window.shadowRoot.querySelector('.window-app-header')
            const button = window.shadowRoot.querySelector('.window-app-close')
            header.insertBefore(appNameContainer, button)
        }
    }
)