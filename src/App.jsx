import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, ServerOff } from "lucide-react";
import { useLeads } from "./hooks/useLeads";
import { exportExcel } from "./utils/exportExcel";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import LeadFilters from "./components/LeadFilters";
import LeadCard from "./components/LeadCard";

export default function App() {
  const {
    leads, city, setCity, category, setCategory,
    loading, loadingMsg, error,
    searchLeads, updateLead, deleteLead,
  } = useLeads();

  const [catFilter, setCatFilter]       = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prospectOnly, setProspectOnly] = useState(false);
  const [search, setSearch]             = useState("");

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      (!q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)) &&
      (catFilter === "All" || l.category === catFilter) &&
      (statusFilter === "All" || l.status === statusFilter) &&
      (!prospectOnly || !l.hasWebsite)
    );
  });

  const stats = {
    total:     leads.length,
    noWebsite: leads.filter((l) => !l.hasWebsite).length,
    contacted: leads.filter((l) => ["Contacted", "Interested"].includes(l.status)).length,
    closed:    leads.filter((l) => l.status === "Closed").length,
  };

  // Clicking a stat card sets the status filter
  const handleStatClick = (key) => {
    if (key === "total")     { setStatusFilter("All"); setCatFilter("All"); setProspectOnly(false); }
    if (key === "noWebsite") { setProspectOnly((v) => !v); }
    if (key === "contacted") { setStatusFilter((s) => s === "Contacted" ? "All" : "Contacted"); }
    if (key === "closed")    { setStatusFilter((s) => s === "Closed"    ? "All" : "Closed"); }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.25rem" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "var(--accent-dim)",
            border: "1px solid rgba(108,99,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Hotel size={22} color="var(--accent)" strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Hospitality Lead Finder
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, paddingLeft: 54 }}>
          Find hotels, restaurants & cafes — pitch them your web & software services.
        </p>
      </motion.div>

      <StatsBar
        stats={stats}
        statusFilter={statusFilter}
        prospectOnly={prospectOnly}
        onStatClick={handleStatClick}
      />

      <SearchBar
        city={city} setCity={setCity}
        category={category} setCategory={setCategory}
        loading={loading} loadingMsg={loadingMsg}
        error={error} onSearch={searchLeads}
      />

      {leads.length > 0 && (
        <LeadFilters
          search={search} setSearch={setSearch}
          catFilter={catFilter} setCatFilter={setCatFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          prospectOnly={prospectOnly} setProspectOnly={setProspectOnly}
          count={filtered.length}
          onExport={() => exportExcel(filtered)}
        />
      )}

      {/* Empty state */}
      <AnimatePresence>
        {leads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            style={{
              textAlign: "center", padding: "4rem 1rem",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius)", marginTop: 16,
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--surface)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <ServerOff size={26} color="var(--text-dim)" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>
              Search a city above to find leads
            </div>
            <div style={{ fontSize: 13, marginTop: 8, color: "var(--text-dim)" }}>
              Connected to <code>{import.meta.env.VITE_BACKEND_URL || "localhost:3001"}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results for active filter */}
      <AnimatePresence>
        {leads.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: "center", padding: "3rem 1rem",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius)", marginTop: 8,
              color: "var(--text-muted)", fontSize: 14,
            }}
          >
            No leads match the current filters.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        <AnimatePresence>
          {filtered.map((lead, i) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onUpdate={updateLead}
              onDelete={deleteLead}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
