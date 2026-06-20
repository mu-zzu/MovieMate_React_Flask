from flask import Flask, jsonify, request
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
@app.route("/movies/filter", methods=["GET"])
def filter_movies():

    genre = request.args.get("genre")
    platform = request.args.get("platform")
    status = request.args.get("status")


    query = Movie.query


    if genre:
        query = query.filter(
            Movie.genre.ilike(f"%{genre}%")
        )


    if platform:
        query = query.filter(
            Movie.platform.ilike(f"%{platform}%")
        )


    if status:
        query = query.filter(
            Movie.status.ilike(f"%{status}%")
        )


    movies = query.all()


    return jsonify([
        movie.to_dict()
        for movie in movies
    ])
@app.route("/movies/sort", methods=["GET"])
def sort_movies():

    sort_by = request.args.get("by", "title")


    if sort_by == "rating":
        movies = Movie.query.order_by(
            Movie.rating.desc()
        ).all()

    else:
        movies = Movie.query.order_by(
            Movie.title.asc()
        ).all()


    return jsonify([
        movie.to_dict()
        for movie in movies
    ])
@app.route("/movies/<int:id>", methods=["GET"])
def get_movie(id):

    movie = Movie.query.get_or_404(id)

    return jsonify(
        movie.to_dict()
    )

@app.route("/movies", methods=["POST"])
def add_movie():
    try:
        data = request.get_json()

        if not data.get("title"):
            return jsonify({
                "error": "Title is required"
            }), 400

        if not data.get("type"):
            return jsonify({
                "error": "Type is required"
            }), 400


        movie = Movie(
            title=data["title"],
            type=data["type"],
            director=data.get("director"),
            genre=data.get("genre"),
            platform=data.get("platform"),
            status=data.get("status", "Wishlist"),
            episodes_watched=data.get("episodes_watched", 0),
            total_episodes=data.get("total_episodes", 0),
            rating=data.get("rating"),
            review=data.get("review"),
             poster_url=data.get("poster_url"),
    year=data.get("year"),
    imdb_rating=data.get("imdb_rating")
        )
 
        db.session.add(movie)
        db.session.commit()


        return jsonify({
            "message": "Movie added successfully",
            "movie": movie.to_dict()
        }), 201


    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/movies/<int:id>", methods=["PUT"])
def update_movie(id):
    movie = Movie.query.get_or_404(id)

    data = request.get_json()

    movie.title = data.get("title", movie.title)
    movie.type = data.get("type", movie.type)
    movie.director = data.get("director", movie.director)
    movie.genre = data.get("genre", movie.genre)
    movie.platform = data.get("platform", movie.platform)
    movie.status = data.get("status", movie.status)
    movie.episodes_watched = data.get(
        "episodes_watched",
        movie.episodes_watched
    )
    movie.total_episodes = data.get(
        "total_episodes",
        movie.total_episodes
    )
    movie.rating = data.get("rating", movie.rating)
    movie.review = data.get("review", movie.review)
    movie.poster_url = data.get(
    "poster_url",
    movie.poster_url
)

    movie.year = data.get(
       "year",
    movie.year
)

    movie.imdb_rating = data.get(
    "imdb_rating",
    movie.imdb_rating
)

    db.session.commit()

    return jsonify({
        "message": "Movie updated successfully!",
        "movie": movie.to_dict()
    })
@app.route("/movies/<int:id>", methods=["DELETE"])
def delete_movie(id):
    movie = Movie.query.get_or_404(id)

    db.session.delete(movie)
    db.session.commit()

    return jsonify({
        "message": "Movie deleted successfully!"
    })


# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True)