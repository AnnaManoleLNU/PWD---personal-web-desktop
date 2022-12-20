/**
 * The messages-app web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
    .hidden {
        display:none;
    }

    .messages {
        overflow-y: scroll;
        height: 200px;
        padding: 5px;
        background: pink;
    }


</style>
<div class="messages" class="hidden"></div>

<form id="username-form">
    <input type="text" id="username-input" placeholder="Enter your username">
    <button type="submit">Submit</button>
</form>
<form id="messages-form" class="hidden">
    <input id="messages-input" type="text" placeholder="Enter your message">
    <button type="submit">Send</button>
</form>
`

customElements.define('messages-app',

    class extends HTMLElement {
        #usernameInput

        #username

        #usernameForm

        #messagesInput

        #messagesForm

        #messages

        #socket

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            // selectors
            this.#usernameInput = this.shadowRoot.querySelector('#username-input')
            this.#usernameForm = this.shadowRoot.querySelector('#username-form')

            this.#messagesInput = this.shadowRoot.querySelector('#messages-input')
            
            this.#messagesForm = this.shadowRoot.querySelector('#messages-form')

            this.#messages = this.shadowRoot.querySelector('.messages')

            // event listeners
            // Event listener for submitting username
            this.#usernameForm.addEventListener('submit', event => {
                event.preventDefault()
                this.#username = this.#usernameInput.value
                this.#usernameForm.setAttribute('class', 'hidden')
                this.#messagesForm.removeAttribute('class', 'hidden')
            })

            // Event listener for submitting message 
            this.#messagesForm.addEventListener('submit', event => {
                event.preventDefault()
                let data = {
                    "type": "message",
                    "data": `${this.#messagesInput.value}`,
                    "username": `${this.#username}`,
                    "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
                }
    
                this.#socket.send(JSON.stringify(data))

                this.#messagesInput.value = ''
            })

            // Socket message event
            this.#socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
            this.#socket.addEventListener('message', event => this.handleMessage(event))
        }

        handleMessage(event) {
            const message = JSON.parse(event.data)
            console.log(event.data)
            const messageElement = document.createElement('div')
            messageElement.textContent = `${message.username}: ${message.data}`
            this.#messages.appendChild(messageElement)

            // Only keep the 20 latest messages
            const excessMessages = this.#messages.children.length - 20
            if (excessMessages > 0) {
                for (let i = 0; i < excessMessages; i++) {
                    this.#messages.removeChild(this.#messages.firstChild)
                }
            }
        }
    }
)