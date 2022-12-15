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

</style>

<h1>Cookbook</h1>
<p>What would you like to cook today?</p>
<ul id="recipe-list"></ul>

`

customElements.define('my-cookbook',

    class extends HTMLElement {
        #recipeList

        constructor() {
            super()

            // Attach a shadow DOM tree to this element and
            // append the template to the shadow root.
            this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true))

            this.#recipeList = this.shadowRoot.querySelector('#recipe-list')
        }

        async connectedCallback() {
            const recipeList = this.#recipeList
            
            // Fetch 3 random recipes
            for (let i = 0; i < 3; i++) {
                // Get recipes from the API
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                const recipe = await response.json()

                const selectedRecipeTitle = recipe.meals[0].strMeal
                const item = document.createElement('li')
                item.textContent = selectedRecipeTitle      
                recipeList.appendChild(item)
            }
        }

    })