"use client";
import { motion } from "framer-motion";
import { BarChart2, WifiOff, TrendingUp, CheckCircle } from "lucide-react";
import { STAT_META } from "../constants";

const ICONS = [BarChart2, WifiOff, TrendingUp, CheckCircle];

const fmt = (key, val) => {
  if (key === "pipeline") return val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;
  return val;
};

export default function StatsBar({ stats, statusFilter, prospectOnly, onStatClick }) {
  const isActive = (key) => {
    if (key === "total")     return statusFilter === "All" && !prospectOnly;
    if (key === "noWebsite") return prospectOnly;
    if (key === "pipeline")  return statusFilter === "Contacted" || statusFilter === "Interested";
    if (key === "closed")    return statusFilter === "Closed";
    return false;
  };

  return (
    <div className="stats-grid">
      {STAT_META.map((s, i) => {
        const Icon   = ICONS[i];
        const active = isActive(s.key);
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -3, boxShadow: `0 8px 32px ${s.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStatClick(s.key)}
            style={{ background: active ? s.glow : "var(--surface)", border: `1px solid ${active ? s.color : "var(--border)"}`, borderRadius: "var(--radius)", padding: "16px 18px", cursor: "pointer", transition: "background 0.2s, border-color 0.2s", position: "relative", overflow: "hidden" }}
          >
            {active && <motion.div layoutId={`strip-${s.key}`} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "var(--radius) var(--radius) 0 0" }} />}
            <div style={{ width: 32, height: 32, borderRadius: 9, background: s.glow, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon size={16} color={s.color} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{fmt(s.key, stats[s.key])}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            {active && <div style={{ fontSize: 9, color: s.color, marginTop: 3, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Filtering ✓</div>}
          </motion.div>
        );
      })}
    </div>
  );
}
