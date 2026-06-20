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
            console.error("Error fetching movies:", error);
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;