function FilterBar({
    genre,
    platform,
    status,
    sort,
    setGenre,
    setPlatform,
    setStatus,
    setSort
}) {
    return (
        <div className="filters">

            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />

            <input
                type="text"
                placeholder="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">All Status</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Wishlist">Wishlist</option>
            </select>


            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="">Sort</option>
                <option value="title">Title</option>
                <option value="rating">
                    Rating
                </option>
            </select>

        </div>
    );
}

export default FilterBar;