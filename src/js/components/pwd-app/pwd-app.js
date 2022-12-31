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
        width: 100%;
        height: 100%;
    }
    
    #taskbar {
        display: flex;
        gap: 20px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: pink;
        height: 50px;
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
        margin: 5px 0px 5px 0px;   
        height: 40px;
        width: 40px;
    }
</style>

<div id="desktop">
    <h1>Welcome to the Web Cafe</h1>
    <h3>Choose your activity</h3>
    <div id="taskbar">
       <div id="app1" class="app-icon"></div>
       <div id="app2" class="app-icon"></div>
       <div id="app3" class="app-icon"></div>
    </div>
</div>
`

customElements.define('pwd-app',

    class extends HTMLElement {

        #desktop

        #taskbar

        #app1

        #app2

        #app3

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            this.#desktop = this.shadowRoot.querySelector('#desktop')
            this.#taskbar = this.shadowRoot.querySelector('#taskbar')
            this.#app1 = this.shadowRoot.querySelector('#app1')
            this.#app2 = this.shadowRoot.querySelector('#app2')
            this.#app3 = this.shadowRoot.querySelector('#app3')
        }

        connectedCallback() {
            this.#app1.addEventListener('click', () => this.openApp('#app1'))
            this.#app2.addEventListener('click', () => this.openApp('#app2'))
            this.#app3.addEventListener('click', () => this.openApp('#app3'))
        }

        openApp(appName) {
            // Add code to open the app here
            console.log(`Opening ${appName}`)
        }
    }
)