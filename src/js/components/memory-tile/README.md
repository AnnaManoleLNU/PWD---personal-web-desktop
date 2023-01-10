# memory-tile

A web component that represents a memory tile and can be used inside a memory-game.


## Attributes

### `disabled`
A boolean attribute which, if present does not allow the user to interact with the tile.

### `face-up`
A boolean attribute which, if present, renders the element faced up, showing its front.

### `hidden`
A boolean attribute which, if present, hides the visibility of the element.


## Events

### Event - `click` event on the tile.
Fired When - The user left clicks on the tile.
Does - flips the tile if it's not disabled.

### Event - `keyboard` event on the tile.
Fired When - The user selects a tile with tab in the memory game and presses enter on it.
Does - flips the tile if it's not disabled.


## Slot
One slot that can be used to store other HTML elements, in this example images.


## Example

```html
   <memory-tile face-up>
      <img src="./img/pizza.png" alt="pizza" />
   </memory-tile>
```