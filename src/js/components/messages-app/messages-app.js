/**
 * The messages-app web component module.
 *
 * @author Anna Manole <am224wd@student.lnu.se>
 * @version 1.1.0
 */

import { Picker } from 'emoji-picker-element'

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>   
    .hidden {
        display:none;
    }

    .messages {
        height: 310px;
        overflow-y: auto;
        word-wrap: break-word;
        white-space: pre-wrap;
        max-width: 500px; 
        padding: 10px 0px 10px 10px;
    }

    form {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 10px;
        height: 30px;
    }

     #messages-input,
     #username-input {
        width: 70%;
        background-color:pink;
        border: none;

        border-radius: 10px;
    }

    button {
        background-color: pink;
        border-radius: 10px;        
        padding: 2px 10px 2px 10px;
    }

    #emoji-button {
        position: relative;
    }

    #emoji-picker-container {
        position: absolute;
        height: 200px;
        top: -200px;
        left: -310px;
    }

    emoji-picker {
        width: 100%;
        height: 100%;
    }

</style>

<div class="messages" class="hidden"></div>

<form id="username-form">
    <input type="text" id="username-input" placeholder="Enter your username">
    <button type="submit">Submit</button>
</form>
<form id="messages-form" class="hidden">
    <input id="messages-input" type="text" placeholder="Enter your message">
    <button id="emoji-button" type="button">😀
        <div id="emoji-picker-container" class="hidden"></div>
    </button>
        <button type="submit">Send</button>
</form>

`
/**
 * Define custom element.
 */
customElements.define('messages-app',

  /**
   * Represents a messages-app element.
   */
  class extends HTMLElement {
    /**
     * The username input field.
     *
     * @type {HTMLInputElement}
     */
    #usernameInput

    /**
     * The username the user has chosen/will choose.
     *
     * @type {string}
     */
    #username

    /**
     * The username form.
     *
     * @type {HTMLFormElement}
     */
    #usernameForm

    /**
     * The messages input field.
     *
     * @type {HTMLInputElement}
     */
    #messagesInput

    /**
     * The messages form.
     *
     * @type {HTMLFormElement}
     */
    #messagesForm

    /**
     * The messages container.
     *
     * @type {HTMLDivElement}
     */
    #messages

    /**
     * The web socket used to send messages to the server.
     *
     * @type {object}
     */
    #socket

    #emojiButton

    #picker

    #emojiPickerContainer

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
      this.#usernameInput = this.shadowRoot.querySelector('#username-input')
      this.#usernameForm = this.shadowRoot.querySelector('#username-form')
      this.#messagesInput = this.shadowRoot.querySelector('#messages-input')
      this.#messagesForm = this.shadowRoot.querySelector('#messages-form')
      this.#messages = this.shadowRoot.querySelector('.messages')

      // Emoji elements selectors and picker creation
      this.#emojiButton = this.shadowRoot.querySelector('#emoji-button')
      this.#picker = new Picker()
      this.#emojiPickerContainer = this.shadowRoot.querySelector('#emoji-picker-container')
      this.#emojiPickerContainer.appendChild(this.#picker)

      // Event listeners
      // Event listener for submitting username
      this.#usernameForm.addEventListener('submit', event => {
        event.preventDefault()
        this.#username = this.#usernameInput.value

        localStorage.setItem('username', this.#username)

        this.#usernameForm.setAttribute('class', 'hidden')
        this.#messagesForm.removeAttribute('class', 'hidden')
      })

      // Event listener for submitting message
      this.#messagesForm.addEventListener('submit', event => {
        event.preventDefault()
        const data = {
          type: 'message',
          data: `${this.#messagesInput.value}`,
          username: `${this.#username}`,
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }

        // on submit send the data and reset the messages input
        this.#socket.send(JSON.stringify(data))
        this.#messagesInput.value = ''
      })

      // Socket message event listener
      this.#socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.#socket.addEventListener('message', event => {
        this.#handleMessage(event)
        // auto scroll when messages div fills
        this.#messages.scrollTop = this.#messages.scrollHeight
      }
      )

      // Picker event listener
      this.#picker.addEventListener('emoji-click', emoji => {
        this.#messagesInput.value += emoji.detail.unicode
      })

      // Emoji button event listener
      this.#emojiButton.addEventListener('click', (event) => {
        this.#emojiPickerContainer.classList.toggle('hidden')
      })

      // Event listener for emoji picker container
      // Stop propagation, so that the picker does not get closed on clicking on the tabs
      this.#emojiPickerContainer.addEventListener('click', event => {
        event.stopPropagation()
      })
    }

    /**
     * Used when the element was added to the DOM.
     */
    connectedCallback () {
      this.#setUsername()
    }

    /**
     * Sets the conditions for a username.
     */
    #setUsername () {
      // For when a username exists already from local storage
      this.#username = localStorage.getItem('username')

      // Check if a username does not exist in the local storage and if not show the username form so the user can populate the local storage
      if (!this.#username) {
        this.#usernameForm.removeAttribute('class', 'hidden')
      } else {
        // If the username is stored, hide the username form and show the messages form
        this.#usernameForm.setAttribute('class', 'hidden')
        this.#messagesForm.removeAttribute('class', 'hidden')
      }
    }

    /**
     * A method that only allows parses the JSON data, creates a div for every message and records the time the message was sent. Only the last 20 messages are displayed in chat.
     *
     * @param {object} event - the event data object.
     */
    #handleMessage (event) {
      const message = JSON.parse(event.data)
      const messageElement = document.createElement('div')
      const date = new Date()

      // Only if the message is not heartbeat, format the message and append it to the messages container.
      if (message.type !== 'heartbeat') {
        messageElement.textContent = `${date.toLocaleTimeString()} ${message.username}: ${message.data}`
        this.#messages.appendChild(messageElement)
      }

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
