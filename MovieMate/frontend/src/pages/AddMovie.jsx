import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { fetchMovieDetails } from "../services/omdb";

function AddMovie() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: "Movie",
        director: "",
        genre: "",
        platform: "",
        status: "Wishlist",
        episodes_watched: 0,
        total_episodes: 0,
        rating: null,
        review: "",
        poster_url: "",
        year: "",
        imdb_rating: "",
    });

    const [fetching, setFetching] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/movies", formData);
            alert("Movie added successfully!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Failed to add movie");
        }
    };

    const handleFetchMovie = async () => {
        if (!formData.title) {
            alert("Enter a movie title first!");
            return;
        }

        setFetching(true);
        const data = await fetchMovieDetails(formData.title);
        setFetching(false);

        if (data && data.Response === "True") {
            setFormData({
                ...formData,
                title: data.Title,
                director: data.Director,
                genre: data.Genre,
                year: data.Year,
                imdb_rating: data.imdbRating,
                poster_url: data.Poster,
                type: data.Type === "series" ? "TV Show" : "Movie",
            });
        } else {
            alert("Movie not found. Try a different title.");
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">
                {/* Header */}
                <div className="form-header">
                    <h1>Add Movie / TV Show</h1>
                    <p>Search by title to auto-fill details, or fill them in manually.</p>
                </div>

                <form className="form-body" onSubmit={handleSubmit}>

                    {/* ── Title + Fetch ── */}
                    <div className="title-search">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="add-title">Movie Title</label>
                            <input
                                id="add-title"
                                className="form-control"
                                type="text"
                                name="title"
                                placeholder="e.g. Inception"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-fetch"
                            id="fetch-details-btn"
                            onClick={handleFetchMovie}
                            disabled={fetching}
                            style={{ alignSelf: "flex-end" }}
                        >
                            {fetching ? (
                                <>
                                    <span className="spinner" />
                                    Fetching…
                                </>
                            ) : (
                                <>🔍 Fetch Details</>
                            )}
                        </button>
                    </div>

                    {/* ── Poster Preview ── */}
                    {formData.poster_url && formData.poster_url !== "N/A" && (
                        <div className="poster-preview-card">
                            <img
                                src={formData.poster_url}
                                alt="Movie Poster"
                                className="poster-preview"
                            />
                            <div className="poster-preview-info">
                                <h4>{formData.title}</h4>
                                {formData.year && (
                                    <p>📅 {formData.year}</p>
                                )}
                                {formData.imdb_rating && formData.imdb_rating !== "N/A" && (
                                    <p>⭐ IMDb {formData.imdb_rating}</p>
                                )}
                                {formData.director && (
                                    <p>🎬 {formData.director}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Type + Status ── */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="add-type">Type</label>
                            <select
                                id="add-type"
                                className="form-control"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option>Movie</option>
                                <option>TV Show</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="add-status">Watch Status</label>
                            <select
                                id="add-status"
                                className="form-control"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option>Wishlist</option>
                                <option>Watching</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Director + Genre ── */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="add-director">Director</label>
                            <input
                                id="add-director"
                                className="form-control"
                                type="text"
                                name="director"
                                value={formData.director}
                                placeholder="Director name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="add-genre">Genre</label>
                            <input
                                id="add-genre"
                                className="form-control"
                                type="text"
                                name="genre"
                                value={formData.genre}
                                placeholder="e.g. Action, Drama"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ── Platform ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="add-platform">Streaming Platform</label>
                        <input
                            id="add-platform"
                            className="form-control"
                            type="text"
                            name="platform"
                            value={formData.platform}
                            placeholder="e.g. Netflix, Prime Video"
                            onChange={handleChange}
                        />
                    </div>

                    {/* ── Episodes (TV Show only) ── */}
                    {formData.type === "TV Show" && (
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="add-ep-watched">Episodes Watched</label>
                                <input
                                    id="add-ep-watched"
                                    className="form-control"
                                    type="number"
                                    name="episodes_watched"
                                    placeholder="0"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="add-ep-total">Total Episodes</label>
                                <input
                                    id="add-ep-total"
                                    className="form-control"
                                    type="number"
                                    name="total_episodes"
                                    placeholder="0"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Rating ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="add-rating">Your Rating (out of 10)</label>
                        <input
                            id="add-rating"
                            className="form-control"
                            type="number"
                            name="rating"
                            value={formData.rating ?? ""}
                            placeholder="1 – 10"
                            min="1"
                            max="10"
                            onChange={handleChange}
                        />
                    </div>

                    {/* ── Review ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="add-review">Your Review</label>
                        <textarea
                            id="add-review"
                            className="form-control"
                            name="review"
                            value={formData.review}
                            placeholder="Write a short review…"
                            onChange={handleChange}
                        />
                    </div>

                    {/* ── Submit ── */}
                    <button type="submit" className="btn-submit" id="add-movie-submit-btn">
                        🎬 Add to Collection
                    </button>

                </form>
            </div>
        </div>
    );
}

export default AddMovie;