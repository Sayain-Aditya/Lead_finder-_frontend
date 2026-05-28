"use client";
import { motion } from "framer-motion";
import { SlidersHorizontal, Download } from "lucide-react";
import { CATEGORIES, STATUS_COLORS } from "../constants";

export default function LeadFilters({ search, setSearch, catFilter, setCatFilter, statusFilter, setStatusFilter, prospectOnly, setProspectOnly, count, onExport }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
      <div className="filters-row">
        <div className="filter-search-wrap">
          <SlidersHorizontal size={13} color="var(--text-dim)" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…" style={{ paddingLeft: 30, paddingTop: 9, paddingBottom: 9, fontSize: 13 }} />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="filter-select">
          {["All", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          {["All", ...Object.keys(STATUS_COLORS)].map((s) => <option key={s}>{s}</option>)}
        </select>
        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: "var(--text-muted)", userSelect: "none", flexShrink: 0 }}>
          <div onClick={() => setProspectOnly((v) => !v)}
            style={{ width: 32, height: 18, borderRadius: 99, background: prospectOnly ? "var(--accent)" : "var(--surface2)", border: "1px solid var(--border)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
            <motion.div animate={{ x: prospectOnly ? 15 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ position: "absolute", top: 2, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
          </div>
          <span style={{ whiteSpace: "nowrap" }}>No website</span>
        </label>
        <motion.button onClick={onExport} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="export-btn">
          <Download size={14} /> <span>Export Excel</span>
        </motion.button>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, fontWeight: 500 }}>
        {count} lead{count !== 1 ? "s" : ""} shown
      </p>
    </motion.div>
  );
}
