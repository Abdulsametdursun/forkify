import icons from 'url:../../img/icons.svg'; // Import icons for the UI

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (exp: recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Abdulsamet Dursun
   */
  render(data, render = true) {
    // Guard Clause: if there's no data, or the data is an empty array, render an error message
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // Store the passed recipe data
    this._data = data;
    // Generate the HTML markup
    const markup = this._generateMarkup();

    if (!render) return markup;

    // Clear the parent element before rendering
    this._clear();
    // Insert the generated markup into the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update only changed text and attributes without re-rendering the entire view
   * @param {Object} data - The updated data to be rendered
   * @this {Object} View instance
   */
  update(data) {
    // Store the passed recipe data
    this._data = data;
    // Generate the HTML markup
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // UPDATE CHANGED TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // UPDATE CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Clear the parent element (recipe container)
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Render a loading spinner while fetching data
   * @this {Object} View instance
   */
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    // Clear the parent element
    this._clear();
    // Insert the spinner markup into the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render an error message in case of failure
   * @param {string} [message = this._errorMessage] - Custom error message
   * @this {Object} View instance
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
        <p>${message}</p>
    </div>
    `;
    // Clear the parent element
    this._clear();
    // Insert the error message markup into the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render a success message for the user
   * @param {string} [message = this._message] - Custom success message
   * @this {Object} View instance
   */
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
        <p>${message}</p>
    </div>
    `;
    // Clear the parent element
    this._clear();
    // Insert the success message markup into the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
