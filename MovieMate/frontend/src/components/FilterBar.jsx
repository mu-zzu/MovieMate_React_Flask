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
        <div className="filter-bar">

            {/* Genre */}
            <div className="filter-field">
                <span className="filter-icon">🎭</span>
                <input
                    type="text"
                    placeholder="Filter by genre…"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    id="filter-genre"
                />
            </div>

            {/* Platform */}
            <div className="filter-field">
                <span className="filter-icon">📺</span>
                <input
                    type="text"
                    placeholder="Filter by platform…"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    id="filter-platform"
                />
            </div>

            {/* Status */}
            <div className="filter-field">
                <span className="filter-icon">🔖</span>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="filter-status"
                >
                    <option value="">All Status</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Wishlist">Wishlist</option>
                </select>
            </div>

            {/* Sort */}
            <div className="filter-field">
                <span className="filter-icon">⇅</span>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    id="filter-sort"
                >
                    <option value="">Sort by…</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

        </div>
    );
}

export default FilterBar;