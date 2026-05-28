import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function SearchBar({ city, setCity, category, setCategory, loading, loadingMsg, error, onSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Search size={14} color="var(--text-muted)" />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Search Businesses via Google Maps
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px", position: "relative" }}>
          <MapPin size={15} color="var(--text-dim)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="City — e.g. Kanpur, Delhi, Mumbai…"
            style={{ width: "100%", padding: "10px 14px 10px 36px", fontSize: 14 }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px 14px", fontSize: 13, minWidth: 140 }}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <motion.button
          onClick={onSearch}
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          style={{
            padding: "10px 24px",
            borderRadius: "var(--radius-sm)",
            background: loading ? "var(--surface2)" : "var(--accent)",
            color: loading ? "var(--text-muted)" : "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "background 0.2s",
          }}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Loader2 size={15} />
              </motion.div>
              Searching…
            </>
          ) : (
            <>
              <Search size={15} />
              Search
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {loading && loadingMsg && (
          <motion.p
            key="msg"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Loader2 size={13} />
            {loadingMsg}
          </motion.p>
        )}
        {error && (
          <motion.div
            key="err"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{
              fontSize: 13,
              color: "var(--red)",
              background: "var(--red-dim)",
              border: "1px solid rgba(239,68,68,0.2)",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
