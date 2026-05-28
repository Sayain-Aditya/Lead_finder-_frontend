import { motion } from "framer-motion";
import { BarChart2, WifiOff, Send, CheckCircle } from "lucide-react";
import { STAT_META } from "../constants";

const ICONS = [BarChart2, WifiOff, Send, CheckCircle];

export default function StatsBar({ stats, statusFilter, prospectOnly, onStatClick }) {
  const isActive = (key) => {
    if (key === "total")     return statusFilter === "All" && !prospectOnly;
    if (key === "noWebsite") return prospectOnly;
    if (key === "contacted") return statusFilter === "Contacted";
    if (key === "closed")    return statusFilter === "Closed";
    return false;
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
      {STAT_META.map((s, i) => {
        const Icon    = ICONS[i];
        const active  = isActive(s.key);

        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -3, boxShadow: `0 8px 32px ${s.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStatClick(s.key)}
            style={{
              background: active ? s.glow : "var(--surface)",
              border: `1px solid ${active ? s.color : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "18px 20px",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* active glow strip at top */}
            {active && (
              <motion.div
                layoutId={`strip-${s.key}`}
                style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: 3, background: s.color,
                  borderRadius: "var(--radius) var(--radius) 0 0",
                }}
              />
            )}

            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: s.glow,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 12,
            }}>
              <Icon size={18} color={s.color} strokeWidth={2} />
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {stats[s.key]}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}>
              {s.label}
            </div>

            {active && (
              <div style={{ fontSize: 10, color: s.color, marginTop: 4, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Filtering ✓
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
