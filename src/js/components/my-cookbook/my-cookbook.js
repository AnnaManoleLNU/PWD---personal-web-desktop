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

    #menu {
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .recipelist {
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    ul li {
       list-style: "\u2661 ";
    }

    .recipelist:hover {
        color:pink;
        cursor: pointer;
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

        #button

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
            this.#button = this.shadowRoot.querySelector('button')
            this.#ingredients = this.shadowRoot.querySelector('#ingredients')

            this.#button.addEventListener('click', (event) => {
                event.preventDefault()
                this.#recipeDetails.setAttribute('class', 'hidden')
                this.#menu.setAttribute('id', 'menu')
            })

        }

        async connectedCallback() {
            // Fetch 3 random recipes
            for (let i = 0; i < 3; i++) {
                // Get recipes from the API
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                const recipe = await response.json()

                // Recipe titles
                const selectedRecipeTitle = recipe.meals[0].strMeal
                this.#recipe = document.createElement('p')
                this.#recipe.textContent = selectedRecipeTitle
                this.#recipeList.appendChild(this.#recipe)
                this.#recipe.setAttribute('class', 'recipelist')

                // create ingredient list 
                const ingredientList = this.createIngredientList(recipe.meals[0])

                // Event listener for clicking on a recipe
                this.#recipe.addEventListener('click', (event) => {
                    event.preventDefault()
                    this.generateInstructions()
                    this.#recipeTitle.textContent = selectedRecipeTitle
                    this.#instructions.textContent = recipe.meals[0].strInstructions

                    // Clear the ingredient list before adding new ingredients
                    while (this.#ingredients.firstChild) {
                        this.#ingredients.removeChild(this.#ingredients.firstChild)
                    }

                    // for every ingredient object
                    for (let ing of ingredientList) {
                        const text = `${ing.ingredient} ${ing.measure}`
                        ing = document.createElement('li')
                        ing.textContent = text
                        this.#ingredients.appendChild(ing)
                    }
                })
            }
        }

        createIngredientList(json) {
            // Initialize empty list of ingredients
            const ingredients = []

            // Loop through each ingredient and measure in the JSON object
            let i = 1
            while (json['strIngredient' + i] && json['strMeasure' + i]) {
                const ingredient = json['strIngredient' + i]
                const measure = json['strMeasure' + i]

                // Add the ingredient and measure to the list
                ingredients.push({ ingredient: ingredient, measure: measure })

                // Increment the counter to move on to the next ingredient and measure
                i++
            }

            return ingredients
        }

        generateInstructions() {
            this.#menu.setAttribute('class', 'hidden')
            this.#menu.removeAttribute('id', '#menu')
            this.#recipeDetails.removeAttribute('class')
        }

    })