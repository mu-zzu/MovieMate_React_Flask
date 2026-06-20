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
        <div className="form-container">
            <h1>Edit Movie</h1>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <input
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    placeholder="Director"
                />

                <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="Genre"
                />

                <input
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    placeholder="Platform"
                />

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Wishlist</option>
                </select>

                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Rating"
                />

                <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Review"
                />

                <button type="submit">
                    Update Movie
                </button>
            </form>
        </div>
    );
}

export default EditMovie;