import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";

function Home() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await api.get("/movies");
            setMovies(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this movie?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/movies/${id}`);

            setMovies(
                movies.filter((movie) => movie.id !== id)
            );

            alert("Movie deleted successfully!");
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    };

    return (
        <div className="home">
            <h1>Your Movie Collection</h1>

            {movies.length === 0 ? (
                <p>No movies added yet.</p>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;