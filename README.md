Project Overview

MovieMate is a full-stack web application that helps users manage their personal collection of movies and TV shows. Users can add, update, delete, and track their watch progress, ratings, and reviews. The application provides a clean and interactive interface built with React and a Flask-based REST API with SQLite database support.

Tech Stack

Frontend
React.js
React Router
Axios
CSS3

Backend
Python Flask
Flask SQLAlchemy
Flask CORS
Database
SQLite
API Integration

OMDb API (for fetching movie details)

Features Implemented
🎥 Movie & TV Show Management
Add movies and TV shows
Update existing entries
Delete entries
View complete movie collection
📺 Watch Tracking
Track watching status:
Watching
Completed
Wishlist
Track TV show episode progress
⭐ Ratings & Reviews
Give personal ratings to watched content
Add reviews and notes
🔍 Search, Filter & Sort
Filter collection by:
Genre
Platform
Watch status
Sort movies by:
Title
Rating
🎨 User Interface
Modern responsive dashboard design
Navigation bar using React Router
Movie cards with organized details
Styled forms for adding and editing content
Background image with improved UI styling
🔗 Backend REST APIs

Implemented RESTful APIs for:

GET all movies
GET single movie details
POST add new movie
PUT update movie information
DELETE movie
Filter and sorting APIs
🗄️ Database
SQLite database integration using Flask-SQLAlchemy
Persistent storage of movie information
🤖 Optional Enhancement – OMDb API
Search movies using OMDb API
Automatically fetch movie details such as:
Movie title
Director
Genre
Release year
IMDb rating
Movie poster preview
