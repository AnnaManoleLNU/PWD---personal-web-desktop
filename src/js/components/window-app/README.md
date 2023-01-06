# window-app

A web component that represents a window application, with the potential of nesting other web components inside it.


## Attributes

### active
The attribute signals that the window is in focus, by raising the z-index value of the last window active in comparisson to previous window active.


## Events

### Event - `mousedown` event on the window app header.
Fired When - The user clicks on the mouse on the window app header.
Does - Sets the initial position of the window application and flags that the element is possible to be dragged.

### Event - `mouseup` event on the window app header.
Fired When - The user stops having the mouse button down.
Does - Flags that the dragging is not possible anymore.

### Event - `mousemove` event on the browser window.
Fired When - The user drags the mouse arround, while having the mousedown.
Does - updates the position of the window application based on the mouse movement and constrains the window application to the browser window. Sets the new postion of the window application at the current dragging coordinates.

### Event - `click` event on close button.
Fired When - The user clicks on x image from the window header.
Does - removes the window application (and any slotted elements) from the DOM.


## Slot
One slot that can be used to house other web components. 


## Example

```html
   <window-app></window-app>
```