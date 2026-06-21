import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";

function Home() {
    const [movies, setMovies]     = useState([]);
    const [genre, setGenre]       = useState("");
    const [platform, setPlatform] = useState("");
    const [status, setStatus]     = useState("");
    const [sort, setSort]         = useState("");

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
            setMovies(movies.filter((movie) => movie.id !== id));
            alert("Movie deleted successfully!");
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    };

    return (
        <div className="home">

            {/* ── Hero Section ── */}
            <section className="hero-section">
                <div className="hero-bg" />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-badge">
                        🎬 <span>Your Personal Cinema</span>
                    </div>
                    <h1 className="hero-title">Welcome to MovieMate</h1>
                    <p className="hero-subtitle">
                        Track your favorite movies and TV shows in one place.
                    </p>
                    <Link to="/add" className="hero-cta" id="hero-cta-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Your First Movie
                    </Link>
                </div>
            </section>

            {/* ── Collection Section ── */}
            <section className="collection-section">
                <div className="collection-header">
                    <h2 className="collection-title">
                        Your Collection
                        {movies.length > 0 && (
                            <span className="count-badge">{movies.length}</span>
                        )}
                    </h2>
                </div>

                {/* Filter Bar */}
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

                {/* Movie Grid / Empty State */}
                {movies.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎥</div>
                        <h3>Your collection is empty.</h3>
                        <p>Add your first movie and start building your personal cinema library!</p>
                        <Link to="/add" className="btn-primary" id="empty-state-add-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Movie
                        </Link>
                    </div>
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
            </section>
        </div>
    );
}

export default Home;