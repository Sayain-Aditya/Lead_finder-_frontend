import { motion } from "framer-motion";
import { SlidersHorizontal, Download } from "lucide-react";
import { CATEGORIES, STATUS_COLORS } from "../constants";

export default function LeadFilters({ search, setSearch, catFilter, setCatFilter, statusFilter, setStatusFilter, prospectOnly, setProspectOnly, count, onExport }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        <div style={{ flex: "1 1 180px", position: "relative" }}>
          <SlidersHorizontal size={14} color="var(--text-dim)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            style={{ width: "100%", padding: "9px 14px 9px 34px", fontSize: 13 }}
          />
        </div>

        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ padding: "9px 14px", fontSize: 13 }}>
          {["All", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "9px 14px", fontSize: 13 }}>
          {["All", ...Object.keys(STATUS_COLORS)].map((s) => <option key={s}>{s}</option>)}
        </select>

        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-muted)", userSelect: "none" }}>
          <div
            onClick={() => setProspectOnly((v) => !v)}
            style={{
              width: 36, height: 20, borderRadius: 99,
              background: prospectOnly ? "var(--accent)" : "var(--surface2)",
              border: "1px solid var(--border)",
              position: "relative", cursor: "pointer",
              transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <motion.div
              animate={{ x: prospectOnly ? 17 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ position: "absolute", top: 2, width: 14, height: 14, borderRadius: "50%", background: "#fff" }}
            />
          </div>
          No website only
        </label>

        <motion.button
          onClick={onExport}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginLeft: "auto",
            padding: "9px 18px",
            borderRadius: "var(--radius-sm)",
            background: "var(--green-dim)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "var(--green)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Download size={14} />
          Export Excel
        </motion.button>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, fontWeight: 500 }}>
        {count} lead{count !== 1 ? "s" : ""} shown
      </p>
    </motion.div>
  );
}
