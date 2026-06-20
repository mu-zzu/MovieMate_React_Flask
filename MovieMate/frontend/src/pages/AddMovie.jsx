import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
        rating: "",
        review: "",
    });

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

    return (
        <div className="form-container">
            <h1>Add Movie / TV Show</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    required
                />

                <select
                    name="type"
                    onChange={handleChange}
                >
                    <option>Movie</option>
                    <option>TV Show</option>
                </select>

                <input
                    type="text"
                    name="director"
                    placeholder="Director"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="platform"
                    placeholder="Platform"
                    onChange={handleChange}
                />

                <select
                    name="status"
                    onChange={handleChange}
                >
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Wishlist</option>
                </select>

                <input
                    type="number"
                    name="episodes_watched"
                    placeholder="Episodes Watched"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="total_episodes"
                    placeholder="Total Episodes"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    onChange={handleChange}
                />

                <textarea
                    name="review"
                    placeholder="Review"
                    onChange={handleChange}
                />

                <button type="submit">
                    Add Movie
                </button>

            </form>
        </div>
    );
}

export default AddMovie;