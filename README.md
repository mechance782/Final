# TV Review App

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
    - [Technologies](#technologies)
- [User Guide](#user-guide)
- [Project Structure](#project-structure)
    - [Naming Conventions](#naming-conventions)
    - [Database Scripts](#database-scripts)
    - [Public Folder](#public-folder)
    - [Views Folder](#views-folder)

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

## Project Structure

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
    - add Script to the end of the ==corresponding ejs== filename (ex: ==home==Script.js)
- **CSS**
    - add Style to the end of the ==corresponding ejs== filename (ex: ==home==Style.css)

### Database Scripts

The database_scripts folder holds a sql file with the sql commands used to locally set up the database connected to this project.

### Views Folder

The views folder holds all embedded javascript files. These are generated dynamically based on data sent to the server. Each ejs is linked to a corresponding .js and .css file. Each ejs is also linked to the favicon image under public/images.

### Public Folder

The public folder holds all static files in the project. There is a folder for images, a folder for scripts, and a folder for styles. Each .ejs file has a corresponding .css and .js file stored in the public folder.
