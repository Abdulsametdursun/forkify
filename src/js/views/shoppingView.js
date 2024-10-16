import View from './View.js';

class ShoppingView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage =
    'There is no shopping list yet. Please add to cart to create one.';

  addHandlerRemoveCart(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--remove-cart');
      if (!btn) return;
      const { description } = btn.dataset;
      handler(description);
    });
  }

  _generateMarkup() {
    return this._data
      .map(
        ing => `
          <li class="cartview">
            <a class="cartview__link" href="#">
              </figure>
              <div class="cartview__data">
                <h4 class="cartview__name">${ing.description}</h4>
                <p class="cartview__quantity">${ing.quantity || ''} ${
          ing.unit || ''
        }</p>
              </div>
              <button class="btn btn--remove-cart" data-description="${
                ing.description
              }">
                Remove
              </button>
            </a>
          </li>
        `
      )
      .join('');
  }
}

export default new ShoppingView();
