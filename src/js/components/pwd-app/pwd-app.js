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
      /** Make it so you can't accidentally select anything on the desktop, so that the background feels like an image */
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

    .app-icon:hover {
        background-color: black
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
/**
 * Define a custom element.
 */
customElements.define('pwd-app',

  /**
   * Represents a pwd-app element.
   */
  class extends HTMLElement {
    /**
     * The messages-app icon.
     *
     * @type {HTMLDivElement}
     */
    #messagesAppIcon

    /**
     * The my-cookbook icon.
     *
     * @type {HTMLDivElement}
     */
    #myCookbookIcon

    /**
     * The memory-app icon.
     *
     * @type {HTMLDivElement}
     */
    #memoryAppIcon

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
      this.#messagesAppIcon = this.shadowRoot.querySelector('#app1')
      this.#myCookbookIcon = this.shadowRoot.querySelector('#app2')
      this.#memoryAppIcon = this.shadowRoot.querySelector('#app3')

      // Event listeners
      // Event listener for clicking on the messages app icon
      this.#messagesAppIcon.addEventListener('click', (event) => {
        this.#createApp('window-app', 'messages-app', 'Messages')
        this.#lastWindowActive()
      })

      // Event listener for clicking on the cookbok app icon
      this.#myCookbookIcon.addEventListener('click', (event) => {
        this.#createApp('window-app', 'my-cookbook', 'Cookbook')
        this.#lastWindowActive()
      })

      // Event listener for clicking on the memory app icon
      this.#memoryAppIcon.addEventListener('click', (event) => {
        this.#createApp('window-app', 'memory-app', 'Memory game')
        this.#lastWindowActive()
      })
    }

    /**
     * Method that "opens" the apps by creating them. Whenever an app is created the attribute is set to active so that the app is on top.  Sets the name of the app by creating the respective element and appending it to the app header.
     *
     * @param {string} win - the name of the window application
     * @param {string} app - the name of the specific application.
     * @param {string} appName - the application's name present in the header.
     */
    #createApp (win, app, appName) {
      // Create the window and app and append the app inside the window
      const windowApp = document.createElement(win)
      const application = document.createElement(app)
      windowApp.appendChild(application)
      windowApp.setAttribute('active', '')
      this.shadowRoot.appendChild(windowApp)

      // Set the name
      const appNameContainer = document.createElement('div')
      const appNameParagraph = document.createElement('p')
      appNameParagraph.style.color = 'black'
      appNameParagraph.style.fontWeight = 'bold'
      appNameContainer.appendChild(appNameParagraph)
      appNameParagraph.textContent = appName
      const header = windowApp.shadowRoot.querySelector('.window-app-header')
      const button = windowApp.shadowRoot.querySelector('.window-app-close')
      header.insertBefore(appNameContainer, button)
    }

    /**
     * On creating a window, removes the active attribute from all others, except the last one created.
     */
    #lastWindowActive () {
      const appWindows = this.shadowRoot.querySelectorAll('window-app')
      const windowsArray = Array.from(appWindows)
      windowsArray.slice(0, -1).forEach(appWindow => appWindow.removeAttribute('active'))
    }
  }
)
