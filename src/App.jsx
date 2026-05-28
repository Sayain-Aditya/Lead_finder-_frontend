import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, ServerOff, LayoutList, Columns } from "lucide-react";
import { useLeads } from "./hooks/useLeads";
import { exportExcel } from "./utils/exportExcel";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import LeadFilters from "./components/LeadFilters";
import LeadCard from "./components/LeadCard";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  const { leads, city, setCity, category, setCategory, loading, loadingMsg, error, searchLeads, updateLead, deleteLead, addCallLog } = useLeads();

  const [catFilter, setCatFilter]       = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prospectOnly, setProspectOnly] = useState(false);
  const [search, setSearch]             = useState("");
  const [view, setView]                 = useState("list");

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      (!q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)) &&
      (catFilter === "All" || l.category === catFilter) &&
      (statusFilter === "All" || l.status === statusFilter) &&
      (!prospectOnly || !l.hasWebsite)
    );
  });

  const pipelineValue = leads
    .filter((l) => ["New", "Contacted", "Interested"].includes(l.status))
    .reduce((s, l) => s + (l.dealValue || 0), 0);

  const stats = {
    total:     leads.length,
    noWebsite: leads.filter((l) => !l.hasWebsite).length,
    pipeline:  pipelineValue,
    closed:    leads.filter((l) => l.status === "Closed").length,
  };

  const handleStatClick = (key) => {
    if (key === "total")     { setStatusFilter("All"); setCatFilter("All"); setProspectOnly(false); }
    if (key === "noWebsite") { setProspectOnly((v) => !v); }
    if (key === "pipeline")  { setStatusFilter((s) => ["Contacted", "Interested"].includes(s) ? "All" : "Contacted"); }
    if (key === "closed")    { setStatusFilter((s) => s === "Closed" ? "All" : "Closed"); }
  };

  return (
    <div className="app-shell">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="app-header">
          <div className="app-header-left">
            <div className="app-logo">
              <Hotel size={20} color="var(--accent)" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="app-title">Hospitality Lead Finder</h1>
              <p className="app-subtitle">Find businesses & pitch your web services.</p>
            </div>
          </div>

          {leads.length > 0 && (
            <div className="view-toggle">
              {[{ id: "list", Icon: LayoutList, label: "List" }, { id: "kanban", Icon: Columns, label: "Kanban" }].map(({ id, Icon, label }) => (
                <motion.button key={id} onClick={() => setView(id)} whileTap={{ scale: 0.95 }} className="view-toggle-btn"
                  style={{ color: view === id ? "var(--accent)" : "var(--text-muted)", background: view === id ? "var(--accent-dim)" : "none" }}>
                  <Icon size={14} /> <span>{label}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <StatsBar stats={stats} statusFilter={statusFilter} prospectOnly={prospectOnly} onStatClick={handleStatClick} />

      <SearchBar city={city} setCity={setCity} category={category} setCategory={setCategory} loading={loading} loadingMsg={loadingMsg} error={error} onSearch={searchLeads} />

      {leads.length > 0 && view === "list" && (
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
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "4rem 1rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)", marginTop: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ServerOff size={26} color="var(--text-dim)" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Search a city above to find leads</div>
            <div style={{ fontSize: 13, marginTop: 8, color: "var(--text-dim)" }}>
              Connected to <code>{import.meta.env.VITE_BACKEND_URL || "localhost:3001"}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban view */}
      {view === "kanban" && leads.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ marginTop: 8 }}>
          <KanbanBoard leads={filtered.length > 0 ? filtered : leads} onUpdate={updateLead} />
        </motion.div>
      )}

      {/* List view */}
      {view === "list" && (
        <>
          <AnimatePresence>
            {leads.length > 0 && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)", marginTop: 8, color: "var(--text-muted)", fontSize: 14 }}>
                No leads match the current filters.
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <AnimatePresence>
              {filtered.map((lead, i) => (
                <LeadCard key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} onAddCallLog={addCallLog} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
