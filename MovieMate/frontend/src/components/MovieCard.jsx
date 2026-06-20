import "./MovieCard.css";

function MovieCard({ movie }) {
    const progress =
        movie.total_episodes > 0
            ? (movie.episodes_watched / movie.total_episodes) * 100
            : 0;

    return (
        <div className="movie-card">
            <h2>{movie.title}</h2>

            <p><strong>Type:</strong> {movie.type}</p>

            <p>
                <strong>Genre:</strong> {movie.genre}
            </p>

            <p>
                <strong>Platform:</strong> {movie.platform}
            </p>

            <p>
                <strong>Status:</strong> {movie.status}
            </p>

            <p>
                <strong>Rating:</strong> ⭐ {movie.rating || "Not rated"}
            </p>

            {movie.type === "TV Show" && (
                <>
                    <p>
                        Episodes: {movie.episodes_watched}/{movie.total_episodes}
                    </p>

                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </>
            )}

            <div className="buttons">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
    );
}

export default MovieCard;