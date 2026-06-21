import { Link } from "react-router-dom";

function MovieCard({ movie, onDelete }) {
    const progress =
        movie.total_episodes > 0
            ? (movie.episodes_watched / movie.total_episodes) * 100
            : 0;

    const statusClass =
        movie.status === "Completed"
            ? "completed"
            : movie.status === "Watching"
            ? "watching"
            : "wishlist";

    const statusDot =
        movie.status === "Completed" ? "●" :
        movie.status === "Watching"  ? "▶" : "☆";

    return (
        <div className="movie-card">
            {/* ── Poster ── */}
            <div className="movie-poster-wrapper">
                {movie.poster_url && movie.poster_url !== "N/A" ? (
                    <img
                        src={movie.poster_url}
                        alt={`${movie.title} poster`}
                        className="movie-poster"
                        loading="lazy"
                    />
                ) : (
                    <div className="poster-fallback">
                        <span className="poster-fallback-icon">🎥</span>
                        <span className="poster-fallback-title">{movie.title}</span>
                    </div>
                )}

                {/* Type badge */}
                <span className="type-badge">{movie.type}</span>

                {/* Hover overlay */}
                <div className="movie-card-overlay">
                    <div className="overlay-actions">
                        <Link to={`/edit/${movie.id}`} style={{ flex: 1 }}>
                            <button className="overlay-btn overlay-btn-edit" id={`edit-btn-${movie.id}`}>
                                ✏️ Edit
                            </button>
                        </Link>
                        <button
                            className="overlay-btn overlay-btn-delete"
                            id={`delete-btn-${movie.id}`}
                            onClick={() => onDelete(movie.id)}
                        >
                            🗑 Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Card Body ── */}
            <div className="movie-card-body">
                {/* Title + Year */}
                <div className="movie-card-header">
                    <h2 className="movie-title">{movie.title}</h2>
                    {movie.year && (
                        <span className="movie-year">{movie.year}</span>
                    )}
                </div>

                {/* Status badge */}
                <span className={`status-badge ${statusClass}`}>
                    {statusDot} {movie.status}
                </span>

                {/* Meta tags */}
                <div className="movie-meta">
                    {movie.genre && (
                        <span className="meta-tag" title={movie.genre}>
                            🎭 {movie.genre}
                        </span>
                    )}
                    {movie.platform && (
                        <span className="meta-tag" title={movie.platform}>
                            📺 {movie.platform}
                        </span>
                    )}
                </div>

                {/* Ratings */}
                <div className="movie-rating-row">
                    {movie.imdb_rating && movie.imdb_rating !== "N/A" ? (
                        <div className="imdb-rating">
                            <span className="imdb-label">IMDb</span>
                            ⭐ {movie.imdb_rating}
                        </div>
                    ) : (
                        <div className="imdb-rating" style={{ color: "var(--text-muted)" }}>
                            <span className="imdb-label" style={{ background: "var(--text-muted)", color: "#fff" }}>IMDb</span>
                            N/A
                        </div>
                    )}

                    {movie.rating && (
                        <span className="user-rating">
                            ⭐ {movie.rating}<span style={{ color: "var(--text-muted)" }}>/10</span>
                        </span>
                    )}
                </div>

                {/* Progress bar for TV Shows */}
                {movie.type === "TV Show" && movie.total_episodes > 0 && (
                    <div className="progress-wrapper">
                        <div className="progress-label">
                            <span>Episodes</span>
                            <span>{movie.episodes_watched}/{movie.total_episodes}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {/* Fallback action buttons (visible on touch devices) */}
                <div className="card-actions">
                    <Link to={`/edit/${movie.id}`} style={{ flex: 1, display: "block" }}>
                        <button className="btn-card-edit" id={`edit-card-btn-${movie.id}`} style={{ width: "100%" }}>
                            ✏️ Edit
                        </button>
                    </Link>
                    <button
                        className="btn-card-delete"
                        id={`delete-card-btn-${movie.id}`}
                        onClick={() => onDelete(movie.id)}
                    >
                        🗑 Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;