"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function SearchBar({ city, setCity, category, setCategory, loading, loadingMsg, error, onSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ background: "rgba(255,253,248,0.86)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px", marginBottom: 16, boxShadow: "var(--shadow)", backdropFilter: "blur(10px)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Search size={13} color="var(--text-muted)" />
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Find New Prospects
        </span>
      </div>

      <div className="search-row">
        <div className="search-input-wrap">
          <MapPin size={14} color="var(--text-dim)" className="search-input-icon" />
          <input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()} placeholder="City — e.g. Kanpur, Delhi…" className="search-input" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="search-select">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <motion.button onClick={onSearch} disabled={loading} whileHover={!loading ? { scale: 1.03 } : {}} whileTap={!loading ? { scale: 0.97 } : {}} className="search-btn"
          style={{ background: loading ? "var(--surface3)" : "var(--accent)", color: loading ? "var(--text-muted)" : "#fffdf8", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 12px 22px rgba(31,111,101,0.18)" }}>
          {loading
            ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={15} /></motion.div>Searching…</>
            : <><Search size={15} />Search</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {loading && loadingMsg && (
          <motion.p key="msg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 10 }} exit={{ opacity: 0, height: 0 }}
            style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <Loader2 size={13} />{loadingMsg}
          </motion.p>
        )}
        {error && (
          <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 10 }} exit={{ opacity: 0, height: 0 }}
            style={{ fontSize: 13, color: "var(--red)", background: "var(--red-dim)", border: "1px solid rgba(163,74,64,0.2)", padding: "10px 14px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={14} />{error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
