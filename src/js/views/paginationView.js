import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Add an event listener to handle pagination button clicks
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto; // Retrieve the target page from the button dataset
      handler(goToPage); // Call the handler with the target page
    });
  }

  // New method to generate button markup for previous/next pages
  _generateMarkupButton(page, type) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--${type}">
        ${
          type === 'prev'
            ? `
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page}</span>
        `
            : `
          <span>Page ${page}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        `
        }
      </button>
    `;
  }

  // Generate pagination markup depending on the current page and total pages
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Display next button only on page 1, if there are more pages
    if (curPage === 1 && numPages > 1) {
      return `
        ${this._generateMarkupButton(curPage + 1, 'next')}
        <span class="pagination__info">Page ${curPage} of ${numPages}</span>
      `;
    }

    // Display previous button only on the last page
    if (curPage === numPages && numPages > 1) {
      return `
        ${this._generateMarkupButton(curPage - 1, 'prev')}
        <span class="pagination__info">Page ${curPage} of ${numPages}</span>
      `;
    }

    // Display both previous and next buttons if we are on any other page
    if (curPage < numPages) {
      return `
      ${this._generateMarkupButton(curPage - 1, 'prev')}
      <span class="pagination__info">Page ${curPage} of ${numPages}</span>
      ${this._generateMarkupButton(curPage + 1, 'next')}
    `;
    }

    // No pagination required if there's only one page
    return '';
  }
}

export default new PaginationView();
