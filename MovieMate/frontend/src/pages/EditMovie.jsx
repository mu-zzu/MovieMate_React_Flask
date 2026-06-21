import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditMovie() {
    const { id } = useParams();
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
        rating: "",
        review: "",
    });

    useEffect(() => {
        fetchMovie();
    }, []);

    const fetchMovie = async () => {
        try {
            const response = await api.get(`/movies/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/movies/${id}`, formData);
            alert("Movie updated successfully!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">
                {/* Header */}
                <div className="form-header">
                    <h1>Edit Movie</h1>
                    <p>Update the details for "{formData.title || "this title"}".</p>
                </div>

                <form className="form-body" onSubmit={handleSubmit}>

                    {/* ── Title ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="edit-title">Movie Title</label>
                        <input
                            id="edit-title"
                            className="form-control"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Movie title"
                            required
                        />
                    </div>

                    {/* ── Type + Status ── */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="edit-type">Type</label>
                            <select
                                id="edit-type"
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
                            <label className="form-label" htmlFor="edit-status">Watch Status</label>
                            <select
                                id="edit-status"
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
                            <label className="form-label" htmlFor="edit-director">Director</label>
                            <input
                                id="edit-director"
                                className="form-control"
                                name="director"
                                value={formData.director}
                                onChange={handleChange}
                                placeholder="Director name"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="edit-genre">Genre</label>
                            <input
                                id="edit-genre"
                                className="form-control"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder="e.g. Action, Drama"
                            />
                        </div>
                    </div>

                    {/* ── Platform ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="edit-platform">Streaming Platform</label>
                        <input
                            id="edit-platform"
                            className="form-control"
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            placeholder="e.g. Netflix, Prime Video"
                        />
                    </div>

                    {/* ── Episodes (TV Show only) ── */}
                    {formData.type === "TV Show" && (
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="edit-ep-watched">Episodes Watched</label>
                                <input
                                    id="edit-ep-watched"
                                    className="form-control"
                                    type="number"
                                    name="episodes_watched"
                                    value={formData.episodes_watched}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="edit-ep-total">Total Episodes</label>
                                <input
                                    id="edit-ep-total"
                                    className="form-control"
                                    type="number"
                                    name="total_episodes"
                                    value={formData.total_episodes}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Rating ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="edit-rating">Your Rating (out of 10)</label>
                        <input
                            id="edit-rating"
                            className="form-control"
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="1 – 10"
                            min="1"
                            max="10"
                        />
                    </div>

                    {/* ── Review ── */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="edit-review">Your Review</label>
                        <textarea
                            id="edit-review"
                            className="form-control"
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            placeholder="Write a short review…"
                        />
                    </div>

                    {/* ── Submit ── */}
                    <button type="submit" className="btn-submit" id="edit-movie-submit-btn">
                        ✅ Update Movie
                    </button>

                </form>
            </div>
        </div>
    );
}

export default EditMovie;