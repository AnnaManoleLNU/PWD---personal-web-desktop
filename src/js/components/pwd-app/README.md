# my-pwd

A web component that represents a personal web desktop. From this web component other webcomponents should be created, removed and interacted with.


## Attributes

No attributes present.


## Events

### Event - `click` event on the messages app icon.
Fired When - The user clicks on the messages app icon.
Does - creates the window-app, appends the messages-app to it. Sets the name corresponding name inside the header of the window. Functionality for having the last window created be active.

### Event - `click` event on the cookbook app icon.
Fired When - The user clicks on the cookbook app icon.
Does - creates the window-app, appends the cookbook-app to it. Sets the name corresponding name inside the header of the window. Functionality for having the last window created be active.

### Event - `click` event on the memory app icon.
Fired When - The user clicks on the memory app icon.
Does - creates the window-app, appends the memory-app to it. Sets the name corresponding name inside the header of the window. Functionality for having the last window created be active.


## Slot

No slots present.


## Example

```html
   <my-pwd></my-pwd>
```