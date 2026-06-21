from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Movie, User
import jwt
from functools import wraps
import datetime
import re

# Create Flask application
app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movies.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "super-secret-key-moviemate-app-1357"

# Connect database with Flask app
db.init_app(app)

# Create database tables automatically
with app.app_context():
    db.create_all()


# Decorator for JWT token verification
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Extract JWT token from Authorization header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Access denied. Authentication token is missing."}), 401

        try:
            # Decode JWT payload
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = db.session.get(User, data["user_id"])
            if not current_user:
                return jsonify({"error": "User not found or session invalid."}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token."}), 401

        return f(current_user, *args, **kwargs)
    return decorated


# Test route
@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to MovieMate Authenticated API!"
    })


# ── AUTHENTICATION ENDPOINTS ──────────────────────────────────────────

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request body"}), 400

        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Validations
        if not username:
            return jsonify({"error": "Username is required."}), 400
        if not email:
            return jsonify({"error": "Email address is required."}), 400
        if not password or len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long."}), 400

        # Validate email structure
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            return jsonify({"error": "Please enter a valid email address."}), 400

        # Check uniqueness
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email address is already registered."}), 400
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username is already taken."}), 400

        # Register User
        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        # Database Migration Support:
        # If this is the FIRST registered user, assign all existing movies that don't have a user_id to them
        is_first_user = User.query.count() == 1
        if is_first_user:
            orphaned_movies = Movie.query.filter(Movie.user_id.is_(None)).all()
            for movie in orphaned_movies:
                movie.user_id = new_user.id
            if orphaned_movies:
                db.session.commit()

        # Generate JWT Token (lasts 7 days)
        token = jwt.encode(
            {"user_id": new_user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({
            "message": "Registration successful!",
            "token": token,
            "user": new_user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request body"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password."}), 401

        # Generate JWT Token (lasts 7 days)
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful!",
            "token": token,
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/logout", methods=["POST"])
def logout():
    # Stateless JWT logout is handled on frontend. Just return success.
    return jsonify({"message": "Logout successful!"}), 200


@app.route("/user", methods=["GET"])
@token_required
def get_user_profile(current_user):
    return jsonify(current_user.to_dict()), 200


# ── PROTECTED MOVIE CRUD ENDPOINTS ────────────────────────────────────

# Get all movies and TV shows for logged-in user
@app.route("/movies", methods=["GET"])
@token_required
def get_movies(current_user):
    movies = Movie.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        movie.to_dict()
        for movie in movies
    ])


# Filter user's movie collection
@app.route("/movies/filter", methods=["GET"])
@token_required
def filter_movies(current_user):
    genre = request.args.get("genre")
    platform = request.args.get("platform")
    status = request.args.get("status")

    query = Movie.query.filter_by(user_id=current_user.id)

    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    if platform:
        query = query.filter(Movie.platform.ilike(f"%{platform}%"))
    if status:
        query = query.filter(Movie.status.ilike(f"%{status}%"))

    movies = query.all()
    return jsonify([
        movie.to_dict()
        for movie in movies
    ])


# Sort user's movie collection
@app.route("/movies/sort", methods=["GET"])
@token_required
def sort_movies(current_user):
    sort_by = request.args.get("by", "title")

    if sort_by == "rating":
        movies = Movie.query.filter_by(user_id=current_user.id).order_by(
            Movie.rating.desc()
        ).all()
    else:
        movies = Movie.query.filter_by(user_id=current_user.id).order_by(
            Movie.title.asc()
        ).all()

    return jsonify([
        movie.to_dict()
        for movie in movies
    ])


# Get a single movie details
@app.route("/movies/<int:id>", methods=["GET"])
@token_required
def get_movie(current_user, id):
    movie = Movie.query.filter_by(user_id=current_user.id, id=id).first_or_404()
    return jsonify(movie.to_dict())


# Add movie to collection
@app.route("/movies", methods=["POST"])
@token_required
def add_movie(current_user):
    try:
        data = request.get_json()

        if not data.get("title"):
            return jsonify({"error": "Title is required"}), 400
        if not data.get("type"):
            return jsonify({"error": "Type is required"}), 400

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
            imdb_rating=data.get("imdb_rating"),
            user_id=current_user.id
        )

        db.session.add(movie)
        db.session.commit()

        return jsonify({
            "message": "Movie added successfully",
            "movie": movie.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Update movie in collection
@app.route("/movies/<int:id>", methods=["PUT"])
@token_required
def update_movie(current_user, id):
    try:
        movie = Movie.query.filter_by(user_id=current_user.id, id=id).first_or_404()
        data = request.get_json()

        movie.title = data.get("title", movie.title)
        movie.type = data.get("type", movie.type)
        movie.director = data.get("director", movie.director)
        movie.genre = data.get("genre", movie.genre)
        movie.platform = data.get("platform", movie.platform)
        movie.status = data.get("status", movie.status)
        movie.episodes_watched = data.get("episodes_watched", movie.episodes_watched)
        movie.total_episodes = data.get("total_episodes", movie.total_episodes)
        movie.rating = data.get("rating", movie.rating)
        movie.review = data.get("review", movie.review)
        movie.poster_url = data.get("poster_url", movie.poster_url)
        movie.year = data.get("year", movie.year)
        movie.imdb_rating = data.get("imdb_rating", movie.imdb_rating)

        db.session.commit()

        return jsonify({
            "message": "Movie updated successfully!",
            "movie": movie.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Delete movie from collection
@app.route("/movies/<int:id>", methods=["DELETE"])
@token_required
def delete_movie(current_user, id):
    try:
        movie = Movie.query.filter_by(user_id=current_user.id, id=id).first_or_404()
        db.session.delete(movie)
        db.session.commit()
        return jsonify({"message": "Movie deleted successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ── PROTECTED STATISTICS ENDPOINT ─────────────────────────────────────

@app.route("/statistics", methods=["GET"])
@token_required
def get_statistics(current_user):
    """Return aggregate statistics for the Statistics Dashboard."""
    from sqlalchemy import func

    total_items     = Movie.query.filter_by(user_id=current_user.id).count()
    completed       = Movie.query.filter_by(user_id=current_user.id, status="Completed").count()
    watching        = Movie.query.filter_by(user_id=current_user.id, status="Watching").count()
    wishlist        = Movie.query.filter_by(user_id=current_user.id, status="Wishlist").count()

    # Average of user-provided ratings (exclude NULL rows)
    avg_rating_row  = db.session.query(func.avg(Movie.rating)).filter(
        Movie.user_id == current_user.id,
        Movie.rating.isnot(None)
    ).scalar()
    average_rating  = round(float(avg_rating_row), 1) if avg_rating_row else 0.0

    # Sum of episodes watched across all TV shows
    episodes_row    = db.session.query(func.sum(Movie.episodes_watched)).filter(
        Movie.user_id == current_user.id
    ).scalar()
    total_episodes_watched = int(episodes_row) if episodes_row else 0

    # Count breakdown: movies vs TV shows
    total_movies    = Movie.query.filter_by(user_id=current_user.id, type="Movie").count()
    total_tv_shows  = Movie.query.filter_by(user_id=current_user.id, type="TV Show").count()

    return jsonify({
        "total_items":           total_items,
        "completed":             completed,
        "watching":              watching,
        "wishlist":              wishlist,
        "average_rating":        average_rating,
        "total_episodes_watched": total_episodes_watched,
        "total_movies":          total_movies,
        "total_tv_shows":        total_tv_shows,
        "last_updated":          datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    })


# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True)