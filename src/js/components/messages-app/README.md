# messages-app

A web component that represents a messages applications, where users connect to a web server with the help of the web socket API.


## Attributes

No attributes present.


## Events

### Event - `submit` event on the username form.
Fired When - The user submits the username.
Does - sets the username to the value of the input form. Thereafter it sets this username into the local storage. It then hides the username form and shows the messages form.

### Event - `submit` event on the messages form.
Fired When - The user submits a message.
Does - the formated data is sent with the help of the web socket api as a JSON string. The messages input gets reset after sending the message.

### Event - `message` event on the web socket.
Fired When - The user sends a message to the web server with the web socket API.
Does - through `#handleMessage(event)` the event data is parsed and for every message that is not of the type heartbeat the message is appended to the messages div container. Only the last 20 messages are displayed in chat. 

### Event - `emoji-click` event on the picker.
Fired When - The user clicks inside the picker and chooses and emoji.
Does - Adds the emoji to the message through its unicode value.

### Event - `click` event on the emoji button.
Fired When - The user clicks on the emoji button.
Does - hides or shows the emoji picker.

### Event - `click` event on the emoji picker container.
Fired When - The user clicks inside the emoji picker container.
Does - stops propagation, so that the picker does not get closed on clicking on the tabs.


## Slot

No slots present.


## Example

```html
   <messages-app></messages-app>
```