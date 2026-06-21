import { useEffect, useState } from "react";
import api from "../services/api";
import StatsCard from "../components/StatsCard";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDateTime(utcStr) {
    if (!utcStr) return "—";
    // utcStr: "2025-01-15 12:34:56 UTC"
    const d = new Date(utcStr.replace(" UTC", "Z"));
    return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard() {
    const [stats, setStats]       = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/statistics");
            setStats(res.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError("Could not load statistics. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Statistics Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Your personal movie and TV watching insights
                    </p>
                </div>
                <div className="stats-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="stats-card stats-card--skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    // ── Error state ─────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Statistics Dashboard</h1>
                </div>
                <div className="dashboard-error">
                    <span className="dashboard-error__icon">⚠️</span>
                    <h3>Failed to load statistics</h3>
                    <p>{error}</p>
                    <button
                        className="btn-primary"
                        id="dashboard-retry-btn"
                        onClick={fetchStats}
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── Data ────────────────────────────────────────────────────────────────
    const completionRate =
        stats.total_items > 0
            ? Math.round((stats.completed / stats.total_items) * 100)
            : 0;

    return (
        <div className="dashboard-page">

            {/* ── Page Header ── */}
            <div className="dashboard-header">
                <div className="dashboard-header__text">
                    <div className="hero-badge" style={{ marginBottom: "16px" }}>
                        📊 <span>Analytics</span>
                    </div>
                    <h1 className="dashboard-title">Statistics Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Your personal movie and TV watching insights
                    </p>
                </div>
                <div className="dashboard-meta">
                    <span className="dashboard-meta__updated">
                        🕐 Last updated: {formatDateTime(stats.last_updated)}
                    </span>
                    <button
                        className="btn-fetch"
                        id="dashboard-refresh-btn"
                        onClick={fetchStats}
                        title="Refresh statistics"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* ── Primary Stats Grid ── */}
            <div className="stats-grid">
                <StatsCard
                    icon="🎬"
                    label="Total in Collection"
                    value={stats.total_items}
                    description="Movies & TV shows"
                    accent="var(--accent-red)"
                    delay={0}
                />
                <StatsCard
                    icon="✅"
                    label="Completed"
                    value={stats.completed}
                    description="Finished watching"
                    accent="var(--status-completed)"
                    delay={80}
                />
                <StatsCard
                    icon="▶️"
                    label="Currently Watching"
                    value={stats.watching}
                    description="In progress"
                    accent="var(--status-watching)"
                    delay={160}
                />
                <StatsCard
                    icon="📌"
                    label="Wishlist"
                    value={stats.wishlist}
                    description="Planned to watch"
                    accent="var(--status-wishlist)"
                    delay={240}
                />
                <StatsCard
                    icon="⭐"
                    label="Avg. User Rating"
                    value={stats.average_rating}
                    suffix="/10"
                    decimals={1}
                    description="Across rated titles"
                    accent="var(--accent-gold)"
                    delay={320}
                />
                <StatsCard
                    icon="📺"
                    label="Episodes Watched"
                    value={stats.total_episodes_watched}
                    description="Total TV episodes"
                    accent="#a78bfa"
                    delay={400}
                />
                <StatsCard
                    icon="🎞️"
                    label="Movies"
                    value={stats.total_movies}
                    description="Feature films"
                    accent="#38bdf8"
                    delay={480}
                />
                <StatsCard
                    icon="📡"
                    label="TV Shows"
                    value={stats.total_tv_shows}
                    description="Series & shows"
                    accent="#f472b6"
                    delay={560}
                />
            </div>

            {/* ── Completion Progress Panel ── */}
            {stats.total_items > 0 && (
                <div className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <h2 className="dashboard-panel__title">
                            📈 Collection Breakdown
                        </h2>
                        <span className="dashboard-panel__subtitle">
                            {completionRate}% completed
                        </span>
                    </div>

                    {/* Status bars */}
                    <div className="breakdown-list">
                        <BreakdownRow
                            label="✅ Completed"
                            count={stats.completed}
                            total={stats.total_items}
                            color="var(--status-completed)"
                            delay={200}
                        />
                        <BreakdownRow
                            label="▶️ Watching"
                            count={stats.watching}
                            total={stats.total_items}
                            color="var(--status-watching)"
                            delay={350}
                        />
                        <BreakdownRow
                            label="📌 Wishlist"
                            count={stats.wishlist}
                            total={stats.total_items}
                            color="var(--status-wishlist)"
                            delay={500}
                        />
                    </div>

                    {/* Type breakdown */}
                    <div className="type-breakdown">
                        <TypePill
                            icon="🎞️"
                            label="Movies"
                            count={stats.total_movies}
                            total={stats.total_items}
                            color="#38bdf8"
                        />
                        <TypePill
                            icon="📡"
                            label="TV Shows"
                            count={stats.total_tv_shows}
                            total={stats.total_items}
                            color="#f472b6"
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BreakdownRow({ label, count, total, color, delay }) {
    const [animate, setAnimate] = useState(false);
    const pct = total > 0 ? (count / total) * 100 : 0;

    useEffect(() => {
        const t = setTimeout(() => setAnimate(true), delay + 300);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div className="breakdown-row">
            <div className="breakdown-row__head">
                <span className="breakdown-row__label">{label}</span>
                <span className="breakdown-row__count">
                    {count} <span style={{ color: "var(--text-muted)" }}>/ {total}</span>
                    <span className="breakdown-row__pct" style={{ color }}>
                        {Math.round(pct)}%
                    </span>
                </span>
            </div>
            <div className="breakdown-bar">
                <div
                    className="breakdown-bar__fill"
                    style={{
                        width: animate ? `${pct}%` : "0%",
                        background: color,
                        boxShadow: `0 0 12px ${color}55`,
                    }}
                />
            </div>
        </div>
    );
}

function TypePill({ icon, label, count, total, color }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="type-pill" style={{ "--pill-color": color }}>
            <span className="type-pill__icon">{icon}</span>
            <div className="type-pill__info">
                <span className="type-pill__label">{label}</span>
                <span className="type-pill__count">{count}</span>
            </div>
            <span className="type-pill__pct" style={{ color }}>{pct}%</span>
        </div>
    );
}

export default Dashboard;
