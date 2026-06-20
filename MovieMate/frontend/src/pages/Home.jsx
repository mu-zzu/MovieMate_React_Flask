import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";

function Home() {
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState("");
const [platform, setPlatform] = useState("");
const [status, setStatus] = useState("");
const [sort, setSort] = useState("");

    useEffect(() => {
        fetchMovies();
    }, [genre, platform, status, sort]);

    const fetchMovies = async () => {
    try {

        let url = "/movies";


        if (genre || platform || status) {
            url = `/movies/filter?genre=${genre}&platform=${platform}&status=${status}`;
        }


        if (sort) {
            url = `/movies/sort?by=${sort}`;
        }


        const response = await api.get(url);

        setMovies(response.data);

    } catch (error) {
        console.log(error);
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

<FilterBar
    genre={genre}
    platform={platform}
    status={status}
    sort={sort}
    setGenre={setGenre}
    setPlatform={setPlatform}
    setStatus={setStatus}
    setSort={setSort}
/>

            {movies.length === 0 ? (
                <p>No movies in your collection yet.
    Start by adding your first movie!.</p>
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