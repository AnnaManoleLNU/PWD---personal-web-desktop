/**
 * The cookbook-app web component module.
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

    h1, h2 {
        color: pink;
    }

    #menu {
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
    }

    #recipedetails {
        padding: 10px 10px 10px 10px;
    }
    
    .recipe-item {        
        text-align: center;
    }

    ul {
        list-style: none;
    }

    ul li:before {
       content: "\u2661 ";
       color: pink;
    }

    .recipe-item:hover {
        color: pink;
        cursor: pointer;
    }

    button {
        background-color: pink;
        border-radius: 10px;        
        padding: 3px 10px 3px 10px;
    }
</style>

<div id="menu">
    <h1>Cookbook</h1>
    <h3>What would you like to cook today?</h3>
    <div id="recipelist"></div>
</div>
<div id="recipedetails" class="hidden">
    <h2 id="title"></h2>
    <ul id="ingredients"></ul>
    <p id="instr"></p>
    <button>Back to Cookbook</button>
</div>
`
/**
 * Define custom element.
 */
customElements.define('my-cookbook',

  /**
   * Represents a my-cookbook element.
   */
  class extends HTMLElement {
    /**
     * The menu screen.
     *
     * @type {HTMLDivElement}
     */
    #menu

    /**
     * The recipe list present on the menu screen that lets the user choose which recipe they want to see.
     *
     * @type {HTMLDivElement}
     */
    #recipeList

    /**
     * The recipe details (title, ingredients and instructions).
     *
     * @type {HTMLDivElement}
     */
    #recipeDetails

    /**
     * The title (name of the recipe) present in the recipe details.
     *
     * @type {HTMLHeadingElement}
     */
    #recipeTitle

    /**
     * The recipe instructions present in the recipe details.
     *
     * @type {HTMLParagraphElement}
     */
    #instructions

    /**
     * The list of ingredients present in the recipe details.
     *
     * @type {HTMLUListElement}
     */
    #ingredients

    /**
     * Button used to go back to the other recipes/the menu screen.
     *
     * @type {HTMLButtonElement}
     */
    #button

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
      this.#menu = this.shadowRoot.querySelector('#menu')
      this.#recipeDetails = this.shadowRoot.querySelector('#recipedetails')
      this.#recipeList = this.shadowRoot.querySelector('#recipelist')
      this.#recipeTitle = this.shadowRoot.querySelector('#title')
      this.#instructions = this.shadowRoot.querySelector('#instr')
      this.#ingredients = this.shadowRoot.querySelector('#ingredients')
      this.#button = this.shadowRoot.querySelector('button')

      // Event listeners
      this.#button.addEventListener('click', (event) => {
        event.preventDefault()
        this.#recipeDetails.setAttribute('class', 'hidden')
        this.#menu.setAttribute('id', 'menu')
      })
    }

    /**
     * Used when the element is added to the DOM.
     */
    async connectedCallback () {
      // Fetch 3 random recipes
      for (let i = 0; i < 3; i++) {
        // Get recipes from the API
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        const recipe = await response.json()

        // Recipe titles
        const selectedRecipeTitle = recipe.meals[0].strMeal
        const recipeOption = document.createElement('p')
        recipeOption.textContent = selectedRecipeTitle
        this.#recipeList.appendChild(recipeOption)
        recipeOption.setAttribute('class', 'recipe-item')

        // create ingredient list
        const ingredientList = this.#createIngredientList(recipe.meals[0])

        // Event listener for clicking on a recipe option
        recipeOption.addEventListener('click', (event) => {
          event.preventDefault()
          this.#showRecipeDetails()
          this.#recipeTitle.textContent = selectedRecipeTitle
          this.#instructions.textContent = recipe.meals[0].strInstructions

          // Clear the ingredient list before adding new ingredients
          // While it has a first child, remove the child
          while (this.#ingredients.firstChild) {
            this.#ingredients.removeChild(this.#ingredients.firstChild)
          }

          // for every ingredient object set the text from the ingredientsList
          for (let ing of ingredientList) {
            const text = `${ing.ingredient} ${ing.measure}`
            ing = document.createElement('li')
            ing.textContent = text
            this.#ingredients.appendChild(ing)
          }
        })
      }
    }

    /**
     * Creates an array of ingredients.
     *
     * @param {object} json - the json object.
     * @returns {Array} - an array of objects (for every object the first value is the ingredient name and the second value is the ingredient measurements)
     */
    #createIngredientList (json) {
      // Initialize empty list of ingredients
      const ingredients = []

      // Loop through each ingredient and measure in the JSON object while ingredients exit.
      let i = 1
      while (json['strIngredient' + i] && json['strMeasure' + i]) {
        const ingredient = json['strIngredient' + i]
        const measure = json['strMeasure' + i]

        // Add the ingredient and measure to the list
        ingredients.push({ ingredient, measure })

        // Increment the counter to move on to the next ingredient and measure
        i++
      }
      return ingredients
    }

    /**
     * Generates instructions for recipe by removing the hidden class from recipeDetails and hiding the menu screen.
     */
    #showRecipeDetails () {
      this.#menu.setAttribute('class', 'hidden')
      this.#menu.removeAttribute('id', '#menu')
      this.#recipeDetails.removeAttribute('class', 'hidden')
    }
  })
