import { useEffect, useRef, useState } from "react";

/**
 * Animated number counter hook.
 * Counts from 0 to `target` over `duration` ms.
 */
function useCountUp(target, duration = 1400, decimals = 0) {
    const [value, setValue] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (target === 0) { setValue(0); return; }

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            setValue(parseFloat(current.toFixed(decimals)));
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(step);
            } else {
                setValue(target);
            }
        };

        rafRef.current = requestAnimationFrame(step);
        return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }, [target, duration, decimals]);

    return value;
}

/**
 * StatsCard – displays an animated statistic with icon, label, and optional suffix.
 *
 * Props:
 *  icon        – emoji or SVG string
 *  label       – card title
 *  value       – numeric target value
 *  suffix      – optional text after number (e.g. "/10")
 *  decimals    – decimal places (default 0)
 *  accent      – CSS color for the icon glow (default accent-red)
 *  delay       – animation stagger delay in ms
 *  description – small subtitle text under the number
 */
function StatsCard({
    icon,
    label,
    value,
    suffix = "",
    decimals = 0,
    accent = "var(--accent-red)",
    delay = 0,
    description = "",
}) {
    const [visible, setVisible] = useState(false);

    // Stagger entrance
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const displayValue = useCountUp(visible ? value : 0, 1400, decimals);

    const formattedValue =
        decimals > 0
            ? displayValue.toFixed(decimals)
            : Math.round(displayValue).toLocaleString();

    return (
        <div
            className={`stats-card ${visible ? "stats-card--visible" : ""}`}
            style={{ "--card-accent": accent }}
        >
            <div className="stats-card__icon-wrap">
                <span className="stats-card__icon">{icon}</span>
            </div>
            <div className="stats-card__body">
                <p className="stats-card__label">{label}</p>
                <p className="stats-card__value">
                    {formattedValue}
                    {suffix && (
                        <span className="stats-card__suffix">{suffix}</span>
                    )}
                </p>
                {description && (
                    <p className="stats-card__desc">{description}</p>
                )}
            </div>
        </div>
    );
}

export default StatsCard;
