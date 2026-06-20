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

    const data = await fetchMovieDetails(formData.title);

    if (data && data.Response === "True") {

        setFormData({
            ...formData,
            title: data.Title,
            director: data.Director,
            genre: data.Genre,
            year: data.Year,
            imdb_rating: data.imdbRating,
            poster_url: data.Poster,
            type: data.Type === "series" ? "TV Show" : "Movie"
        });

        alert("Movie details fetched successfully!");

    } else {
        alert("Movie not found.");
    }
};

    return (
        <div className="form-container">
            <h1>Add Movie / TV Show</h1>

            <form onSubmit={handleSubmit}>

               <div className="title-search">

    <input
        type="text"
        name="title"
        placeholder="Enter movie title"
        value={formData.title}
        onChange={handleChange}
        required
    />

    <button
        type="button"
        onClick={handleFetchMovie}
    >
        🔍 Fetch Details
    </button>

</div>
 {
        formData.poster_url && (
            <img
                src={formData.poster_url}
                alt="Movie Poster"
                className="poster-preview"
            />
        )
    }


               <select
    name="type"
    value={formData.type}
    onChange={handleChange}
>
                    <option>Movie</option>
                    <option>TV Show</option>
                </select>

                <input
    type="text"
    name="director"
    value={formData.director}
    placeholder="Director"
    onChange={handleChange}
/>

                 <input
    type="text"
    name="genre"
    value={formData.genre}
    placeholder="Genre"
    onChange={handleChange}
/>

                <input
    type="text"
    name="platform"
    value={formData.platform}
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
    value={formData.rating}
    placeholder="Your Rating"
    onChange={handleChange}
/>

              <textarea
    name="review"
    value={formData.review}
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