"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, ServerOff, LayoutList, Columns, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import { exportExcel } from "../utils/exportExcel";
import SearchBar from "../components/SearchBar";
import StatsBar from "../components/StatsBar";
import LeadFilters from "../components/LeadFilters";
import LeadCard from "../components/LeadCard";
import KanbanBoard from "../components/KanbanBoard";

const PAGE_SIZE = 10;

export default function HomePage() {
  const { leads, city, setCity, category, setCategory, loading, loadingMsg, error, searchLeads, updateLead, deleteLead, addCallLog } = useLeads();

  const [catFilter, setCatFilter]       = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prospectOnly, setProspectOnly] = useState(false);
  const [search, setSearch]             = useState("");
  const [view, setView]                 = useState("list");
  const [cityFilter, setCityFilter]     = useState("All");
  const [searchedCities, setSearchedCities] = useState([]);
  const [page, setPage]                 = useState(1);

  // pre-populate city list from leads already in DB
  const addCities = (leadList) => {
    const cities = [...new Set(leadList.map((l) => l.city).filter(Boolean)
      .map((c) => c.trim().replace(/\b\w/g, (ch) => ch.toUpperCase())))];
    setSearchedCities((prev) => {
      const merged = [...prev];
      cities.forEach((c) => { if (!merged.includes(c)) merged.push(c); });
      return merged;
    });
  };

  // when leads load from DB on mount, populate city filter
  useEffect(() => { if (leads.length) addCities(leads); }, [leads.length]);

  const handleSearch = async () => {
    await searchLeads();
    if (city.trim()) {
      const normalised = city.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      setSearchedCities((prev) => prev.includes(normalised) ? prev : [...prev, normalised]);
      setCityFilter(normalised);
      setPage(1);
    }
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      (cityFilter === "All" || l.city.toLowerCase() === cityFilter.toLowerCase()) &&
      (!q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)) &&
      (catFilter === "All" || l.category === catFilter) &&
      (statusFilter === "All" || l.status === statusFilter) &&
      (!prospectOnly || !l.hasWebsite)
    );
  });

  // count of leads per city (unaffected by other filters)
  const cityStats = leads.reduce((acc, l) => {
    const c = (l.city || "").trim().replace(/\b\w/g, (ch) => ch.toUpperCase());
    if (c) acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
      <SearchBar city={city} setCity={setCity} category={category} setCategory={setCategory} loading={loading} loadingMsg={loadingMsg} error={error} onSearch={handleSearch} />

      {leads.length > 0 && view === "list" && (
        <LeadFilters
          search={search} setSearch={(v) => { setSearch(v); setPage(1); }}
          catFilter={catFilter} setCatFilter={(v) => { setCatFilter(v); setPage(1); }}
          statusFilter={statusFilter} setStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
          prospectOnly={prospectOnly} setProspectOnly={(v) => { setProspectOnly(typeof v === "function" ? v(prospectOnly) : v); setPage(1); }}
          cityFilter={cityFilter} setCityFilter={(v) => { setCityFilter(v); setPage(1); }}
          searchedCities={searchedCities}
          cityStats={cityStats}
          count={filtered.length}
          onExport={() => exportExcel(filtered)}
        />
      )}

      <AnimatePresence>
        {leads.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "4rem 1rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)", marginTop: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ServerOff size={26} color="var(--text-dim)" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Search a city above to find leads</div>
            <div style={{ fontSize: 13, marginTop: 8, color: "var(--text-dim)" }}>
              Connected to <code>{process.env.NEXT_PUBLIC_BACKEND_URL || "localhost:3001"}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === "kanban" && leads.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ marginTop: 8 }}>
          <KanbanBoard leads={filtered.length > 0 ? filtered : leads} onUpdate={updateLead} />
        </motion.div>
      )}

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
              {paginated.map((lead, i) => (
                <LeadCard key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} onAddCallLog={addCallLog} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, marginBottom: 8 }}>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--surface)", color: safePage === 1 ? "var(--text-dim)" : "var(--text)", cursor: safePage === 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
                <ChevronLeft size={14} /> Prev
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} style={{ color: "var(--text-dim)", fontSize: 13, padding: "0 4px" }}>…</span>
                  ) : (
                    <motion.button key={p} whileTap={{ scale: 0.93 }} onClick={() => setPage(p)}
                      style={{ minWidth: 32, padding: "6px 10px", borderRadius: "var(--radius)", border: "1px solid", borderColor: p === safePage ? "var(--accent)" : "var(--border)", background: p === safePage ? "var(--accent-dim)" : "var(--surface)", color: p === safePage ? "var(--accent)" : "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: p === safePage ? 600 : 400 }}>
                      {p}
                    </motion.button>
                  )
                )}

              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--surface)", color: safePage === totalPages ? "var(--text-dim)" : "var(--text)", cursor: safePage === totalPages ? "not-allowed" : "pointer", fontSize: 13 }}>
                Next <ChevronRight size={14} />
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
