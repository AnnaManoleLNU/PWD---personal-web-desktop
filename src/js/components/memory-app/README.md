# memory-app

A web component that represents a memory app.


## Attributes

No attributes present.


## Events

### Event (3 event listeners) - `click` event on options.
Fired When - The user clicks on either of the 2x2, 2x4 or 4x4 options.
Does - initialize the game in the respective format. Certain elements are hidden while the game is displayed. Tiles are created, the images are shuffled, the game logic is set and the time for the game start is recorded.

### Event - `memory-tile:flip`
Fired When - a card gets flipped.
Does - it sets rules for playing the game. When two tiles match they get the attribute hidden. If the tiles don't match they get flipped back around. Only two tiles may be flipped at the same time, the others are disabled while the matching occurs.

### Event - `memory-game:game-over` 
Fired When - all the tiles are matched (they have the disabled and face-up attributes).
Does - hides the game and displays the end-game message. Records the end time of the game and calculates the total time for the user to finish the game. It also sets the functionality for clicking the play again button.

### Event - `click` event on the play again button.
Fired When - The user presses the play again button at the end of the game.
Does - Event on clicking the play again button after finishing a game. Hide or show relevant parts of the component, reset the innerHTML of the game, reset the matching of the tiles to 0 and the images to the original array.


## Example

```html
   <memory-app></memory-app>
```