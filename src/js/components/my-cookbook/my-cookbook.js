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
</style>

<div id="menu">
    <h1>Cookbook</h1>
    <h3>What would you like to cook today?</h3>
    <div id="recipe-list"></div>
</div>
<div id="recipedetails" class="hidden">
    <h1 id="title"></h1>
    <ul id="ingredients"></ul>
    <p id="instr"></p>
    <button>Back to Cookbook</button>
</div>

`

customElements.define('my-cookbook',

    class extends HTMLElement {
        #menu

        #recipeDetails

        #recipeList

        #recipe

        #recipeTitle

        #instructions

        #ingredients

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            this.#menu = this.shadowRoot.querySelector('#menu')
            this.#recipeDetails = this.shadowRoot.querySelector('#recipedetails')
            this.#recipeList = this.shadowRoot.querySelector('#recipe-list')
            this.#recipeTitle = this.shadowRoot.querySelector('#title')
            this.#instructions = this.shadowRoot.querySelector('#instr')
        
        }
        
        async connectedCallback() {
            const recipeList = this.#recipeList

            // Fetch 3 random recipes
            for (let i = 0; i < 3; i++) {
                // Get recipes from the API
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                const recipe = await response.json()
                
                const selectedRecipeTitle = recipe.meals[0].strMeal
                this.#recipe = document.createElement('p')
                this.#recipe.textContent = selectedRecipeTitle

                // get all the ingredients and corresponding measurement
                this.#ingredients = recipe.meals[0].strIngredient1

                // get instructions
                
                this.#recipe.addEventListener('click', () => {
                    console.log('generating instructions', selectedRecipeTitle)
                    this.generateInstructions()
                    this.#recipeTitle.textContent = selectedRecipeTitle
                    this.#instructions.textContent = recipe.meals[0].strInstructions
                })
                
                recipeList.appendChild(this.#recipe)
            }
        }

        generateInstructions() {
            this.#menu.setAttribute('class', 'hidden')
            this.#recipeDetails.removeAttribute('class')
        }
        
    })