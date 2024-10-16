import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Import icons for the UI
import { Fraction } from 'fractional'; // Import fractional for formatting quantities

class RecipeView extends View {
  // The parent element where the recipe will be rendered
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!!!';
  _message = '';

  /**
   * Attach event listeners for rendering the recipe when the page is loaded or hash changes
   * @param {Function} handler - Controller function to handle the event
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Attach event listeners to update servings when the user clicks the serving buttons
   * @param {Function} handler - Controller function to handle servings update
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddCart(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--shopping');
      if (!btn) return;
      handler();
    });
  }

  /**
   * Attach event listeners to add or remove bookmarks
   * @param {Function} handler - Controller function to handle bookmark actions
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  /**
   * Generate the HTML markup for the recipe
   * @returns {string} The HTML markup for the recipe
   * @this {Object} RecipeView instance
   */
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>

          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>

           <button class="btn--round btn--shopping">
                <svg class="">
                <use href="${icons}#icon-shoppingCart${
      this._data.inCart ? '-fill' : ''
    }"></use>
                </svg>
              </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngredient.bind(this))
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>.
            Please check out directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      `;
  }

  /**
   * Generate the HTML markup for an individual ingredient
   * @param {Object} ing - Ingredient object
   * @returns {string} The HTML markup for the ingredient
   */
  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
    <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? new Fraction(ing.quantity).toString() : ''
    }</div> <!-- Format quantity using Fraction if available -->
    <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>${ing.description}
    </div>
    </li>
  `;
  }
}

// Export an instance of RecipeView
export default new RecipeView();
