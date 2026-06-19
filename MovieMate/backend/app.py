from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Movie


# Create Flask application
app = Flask(__name__)

# Enable CORS (allows React frontend to communicate with Flask)
CORS(app)

# SQLite database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movies.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Connect database with Flask app
db.init_app(app)


# Create database tables automatically
with app.app_context():
    db.create_all()


# Test route
@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to MovieMate API!"
    })


# Get all movies and TV shows
@app.route("/movies", methods=["GET"])
def get_movies():
    movies = Movie.query.all()

    return jsonify([
        movie.to_dict()
        for movie in movies
    ])


# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True)