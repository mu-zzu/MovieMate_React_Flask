from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """Registered users for MovieMate authentication."""
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80),  unique=True, nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id":         self.id,
            "username":   self.username,
            "email":      self.email,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # Movie or TV Show
    director = db.Column(db.String(100))
    genre = db.Column(db.String(50))
    platform = db.Column(db.String(50))

    status = db.Column(
        db.String(20),
        default="Wishlist"
    )  # Watching, Completed, Wishlist

    episodes_watched = db.Column(
        db.Integer,
        default=0
    )

    total_episodes = db.Column(
        db.Integer,
        default=0
    )

    rating = db.Column(
        db.Float
    )

    review = db.Column(
        db.Text
    )
    poster_url = db.Column(db.String(500))
    year = db.Column(db.String(10))
    imdb_rating = db.Column(db.String(10))

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "director": self.director,
            "genre": self.genre,
            "platform": self.platform,
            "status": self.status,
            "episodes_watched": self.episodes_watched,
            "total_episodes": self.total_episodes,
            "rating": self.rating,
            "review": self.review,
            "poster_url": self.poster_url,
            "year": self.year,
            "imdb_rating": self.imdb_rating,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }