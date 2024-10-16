import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

// Application state object to store the recipe data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  cart: [], // Added cart state
};

/**
 * Create a recipe object with the necessary properties
 * @param {Object} data - Recipe data from the API
 * @returns {Object} Cleaned recipe object with essential properties
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // If key exists, include it
  };
};

/**
 * Load a recipe based on the given ID
 * @param {string} id - Recipe ID
 * @throws Will throw an error if the request fails
 */
export const loadRecipe = async function (id) {
  try {
    // Fetch recipe data from the API
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // Check if the recipe is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Catch and throw any errors
    console.error(`⚠ ⚠ ${err} ⚠ ⚠`);
    throw err;
  }
};

// Function to load search results based on the user's query
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }), // If key exists, include it
    }));
    state.search.page = 1;
  } catch (err) {
    console.error(`⚠ ⚠ ${err} ⚠ ⚠`);
    throw err;
  }
};

/**
 * Retrieve a paginated version of search results
 * @param {number} [page=state.search.page] - Page number
 * @returns {Array} Sliced array of search results
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Update servings based on user input and adjust ingredient quantities
 * @param {number} newServings - New number of servings
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

/**
 * Save bookmarks to localStorage
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Function to persist cart data
const persistCart = function () {
  localStorage.setItem('cart', JSON.stringify(state.cart));
};

/**
 * Add a recipe to the bookmarks list
 * @param {Object} recipe - Recipe object to bookmark
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Remove a recipe from the bookmarks list by ID
 * @param {string} id - Recipe ID
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Add a recipe's ingredients to the cart
export const addToCart = function (recipe) {
  const ingredients = recipe.ingredients;
  if (ingredients) {
    state.cart.push(...ingredients);
    persistCart();
  }
};

// Remove an ingredient from the cart by description
export const removeFromCart = function (description) {
  const index = state.cart.findIndex(ing => ing.description === description);
  if (index !== -1) {
    state.cart.splice(index, 1);
    persistCart();
  }
};

// Initialize bookmarks and cart from localStorage
const init = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);

  const storageCart = localStorage.getItem('cart');
  if (storageCart) state.cart = JSON.parse(storageCart);
};
init();

/**
 * Clear all bookmarks from localStorage
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

/**
 * Upload a new recipe to the API
 * @param {Object} newRecipe - Recipe data from form input
 * @throws Will throw an error if the format is incorrect or request fails
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Incorrect formatting, Please use the correct formatting.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
