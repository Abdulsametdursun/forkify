import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import shoppingView from './views/shoppingView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// Polyfilling for stable JS features
import 'core-js/stable';
// Polyfilling async/await support
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView.js';

/**
 * Main controller function for loading and displaying recipes
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // Get the recipe ID from the URL

    // Guard clause: If no ID is present, return early
    if (!id) return;
    recipeView.renderSpinner(); // Show loading spinner while fetching recipe

    // Update selected search result and bookmark views
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Load the recipe from the API
    await model.loadRecipe(id);

    // Render the recipe on the page
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(); // Render an error message if there's an issue
  }
};

/**
 * Controller function for handling search results
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // Show spinner while fetching search results

    const query = searchView.getQuery(); // Get the search query from the user
    if (!query) {
      resultsView.renderError(
        'We could not find that recipe. Please try another one!!!'
      );
      return;
    }

    // Load search results from the API
    await model.loadSearchResults(query);

    // Render the results and pagination
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(); // Render an error if something goes wrong
  }
};

/**
 * Controller function for handling pagination clicks
 * @param {number} goToPage - The page number to go to
 */
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage)); // Render the new set of paginated results
  paginationView.render(model.state.search); // Render updated pagination buttons
};

/**
 * Controller function to handle updating servings
 * @param {number} newServings - The new number of servings
 */
const controlServings = function (newServings) {
  model.updateServings(newServings); // Update recipe servings in the state
  recipeView.update(model.state.recipe); // Update the recipe view
};

/**
 * Controller function to handle adding/removing bookmarks
 */
const controlAddBookmark = function () {
  // Add or remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the view
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks); // Render updated bookmarks list
};

/**
 * Controller function to render bookmarks on load
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddCart = function () {
  if (!model.state.recipe.ingredients) return;
  model.addToCart(model.state.recipe);
  shoppingView.render(model.state.cart);
};

const controlRemoveCart = function (description) {
  model.removeFromCart(description);
  shoppingView.render(model.state.cart);
  console.log(model.state.recipe);
};

/**
 * Controller function to handle adding a new recipe
 * @param {Object} newRecipe - Recipe data from the form
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner(); // Show loading spinner

    await model.uploadRecipe(newRecipe); // Upload the new recipe

    recipeView.render(model.state.recipe); // Render the uploaded recipe
    addRecipeView.renderMessage(); // Show success message
    bookmarksView.render(model.state.bookmarks); // Render updated bookmarks

    // Change the URL to the new recipe's ID without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the modal window after a few seconds
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message); // Render error message if upload fails
  }
};

// Initialize the application by attaching event handlers
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandleUpload(controlAddRecipe);
  recipeView.addHandlerAddCart(controlAddCart);
  shoppingView.addHandlerRemoveCart(controlRemoveCart);
};
init();
