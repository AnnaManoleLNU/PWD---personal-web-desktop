# my-cookbook

A web component that represents a cookbook application. The application fetches 3 random recipes from an API.


## Attributes

No attributes present.


## Events

### Event - `click` event on the recipe option.
Fired When - The user click on one of the recipes alternatives present in the menu.
Does - shows the recipe details. Sets the title of the recipe, the ingredients and the instructions. Remove the previous ingredients.

### Event - `click` event on the button.
Fired When - The user clicks on the button at the bottom of the instructions.
Does - go back to the selection menu and hides the recipe details.


## Slot

No slots present.


## Example

```html
   <my-cookbook></my-cookbook>
```