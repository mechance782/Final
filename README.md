# TV Review App

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
    - [Technologies](#technologies)
- [User Guide](#user-guide)
- [Project Structure](#project-structure)
    - [Database Scripts](#database-scripts)
    - [Public Folder](#public-folder)
    - [Views Folder](#views-folder)
    - [Naming Conventions](#naming-conventions)

## Overview

This program lets users post, view, and search for TV show reviews.

### Technologies

- [dotenv](https://www.npmjs.com/package/dotenv)
- [ejs](https://ejs.co)
- [express](https://expressjs.com/en/api.html)
- [mariadb](https://mariadb.org)
- [nodemon](https://nodemon.io)
- [Font Awesome](https://fontawesome.com)

## User Guide
The user should enter the application on the home page. The home page will display recently posted reviews, if there are any. The user can click on a review to view the full post, or the user can click on the menu button at the top-left to view the menu. From the menu, the user can view the home page, create a review, or search for reviews. 

If the user clicks "Post a Review" they will be taken to the form page. They will enter required info: (Show Title, Genre, Audience Rating, and Star Rating), and optional info: (Review Title, Review Content, and username).

Once the user fills out the form correctly and presses post, they will be taken to a success page that shows the user how their post will appear on the website.

If the user clicks on the menu and then clicks "Search" they will be taken to a search page. The user is able to search for reviews by searching for a title, keywords, genre, audience rating, star rating, and username. The user would also be able to sort the reviews by any of the above categories. 

## Project Structure

The project entry point is app.js. The routes in app.js render the ejs pages. The .ejs files are under the views folder. The .js and .css files are under the public folder, as well as image files. The database_scripts folder is not required to build the program, but has the sql commands needed to locally set up the database. 

### Database Scripts

The database_scripts folder holds a sql file with the sql commands used to locally set up the database connected to this project.

### Views Folder

The views folder holds all embedded javascript files. These are generated dynamically based on data sent to the server. Each ejs is linked to a corresponding .js and .css file. Each ejs is also linked to the favicon image under public/images.

### Public Folder

The public folder holds all static files in the project. There is a folder for images, a folder for scripts, and a folder for styles. Each .ejs file has a corresponding .css and .js file stored in the public folder.

### Naming Conventions

- **camelCase**
    - file names (ex: fileName.file)
    - variable names (ex: variableName)
    - class and id names (ex: className idName)
- **lower_case**
    - folder names (ex: folder_name)
    - database name and columns (ex: database_name)
- **UPPER_CASE**
    - .env variables (ex: ENV_VARIABLE)
- **javaScript**
    - add Script to the end of the corresponding ejs filename (ex: homeScript.js)
- **CSS**
    - add Style to the end of the corresponding ejs filename (ex: homeStyle.css)

