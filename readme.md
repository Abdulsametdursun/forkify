Recipe Application

This is a JavaScript-based Recipe Application that allows users to search for recipes, view detailed information, and bookmark their favorite recipes. The application is built using modern JavaScript features and API calls to retrieve and display recipe data dynamically.
Features

    Search Recipes: Users can search for recipes by entering a keyword.
    Recipe Details: Displays detailed recipe information, including ingredients, cooking time, servings, and publisher.
    Bookmark Recipes: Users can bookmark recipes, and the bookmarks persist even after page reloads.
    Pagination: Results are paginated to ensure a smoother user experience for large sets of search results.
    Add Custom Recipe: Users can submit their own recipes using the "Add Recipe" feature.
    Responsive UI: The interface is responsive, adapting to various screen sizes.

Technologies Used

    JavaScript: The core language used to build the application.
    HTML/CSS: For structuring and styling the front-end.
    Sass: Preprocessor for CSS.
    Parcel: Bundler used for development and production builds.
    API: Recipe data is fetched from an external recipe API.
    Fractional Library: For proper ingredient quantity formatting.
    LocalStorage: For persisting user bookmarks between sessions.

Getting Started
Prerequisites

To run this project, you'll need to have the following installed on your local machine:

    Node.js (v14 or higher)
    Parcel Bundler (for development and building)

Installation

    Clone the Repository:

    bash

git clone https://github.com/your-username/recipe-app.git

Navigate to the Project Directory:

bash

cd recipe-app

Install Dependencies:

Run the following command to install the necessary packages:

bash

npm install

Start the Development Server:

bash

npm run start

This command will start a local development server, and you can access the app at http://localhost:1234.

Build for Production:

To bundle the project for production, run:

bash

    npm run build

Usage
Searching for Recipes

    Enter a search query (e.g., "pizza") in the search bar and press enter.
    Search results will be displayed, with the option to paginate through them.

Viewing a Recipe

    Click on any recipe from the search results to view its details.
    The recipe page will show the ingredients, cooking time, servings, and a link to the source.

Bookmarking Recipes

    To bookmark a recipe, click the bookmark icon.
    The recipe will be added to your bookmarks, which you can view by clicking the bookmarks button in the navigation.

Adding a Recipe

    Click the "Add Recipe" button in the navigation.
    Fill out the form with the required details and submit your recipe.
    Your custom recipe will be added to the list and saved in your bookmarks.

Project Structure

bash

├── src
│ ├── img # Images used in the application
│ ├── js
│ │ ├── controller.js # Main controller that ties the app together
│ │ ├── model.js # Handles application state and API requests
│ │ ├── views # Contains all the view classes
│ │ │ ├── recipeView.js # View for displaying a single recipe
│ │ │ ├── searchView.js # View for handling search input
│ │ │ ├── bookmarksView.js# View for handling bookmarks
│ │ │ ├── paginationView.js # View for pagination
│ │ ├── helpers.js # Utility functions like AJAX request handler
│ │ ├── config.js # App configuration constants (API URL, etc.)
│ ├── styles
│ │ ├── main.scss # Main Sass file
├── package.json # Dependencies and scripts
├── README.md # Project documentation

API

This project uses the Forkify API to fetch recipe data.
Endpoints:

    Search Recipes: GET /?search=QUERY
    Get Recipe by ID: GET /:id
    Submit Recipe: POST /?key=YOUR_API_KEY

Make sure to obtain an API key and replace the KEY variable in the config.js file with your own.
Scripts

    npm run start - Start the development server
    npm run build - Build the project for production
    npm run clean - Clear the dist folder (optional)

Contributing

Contributions are welcome! Please follow these steps:

    Fork the project.
    Create a feature branch (git checkout -b feature/new-feature).
    Commit your changes (git commit -m 'Add new feature').
    Push to the branch (git push origin feature/new-feature).
    Create a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for more details.
Acknowledgements

This project is inspired by the Forkify Project from Jonas Schmedtmann's JavaScript course on Udemy.
#   f o r k i f y  
 