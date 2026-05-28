import { motion } from "framer-motion";
import { MapPin, Phone, WifiOff, Star, TrendingUp } from "lucide-react";
import { STATUS_COLORS, KANBAN_COLUMNS, PRIORITY_META } from "../constants";

export default function KanbanBoard({ leads, onUpdate }) {
  return (
    <div className="kanban-board">
      {KANBAN_COLUMNS.map((col) => {
        const sc = STATUS_COLORS[col];
        const colLeads = leads.filter((l) => l.status === col);
        const colValue = colLeads.reduce((s, l) => s + (l.dealValue || 0), 0);

        return (
          <div key={col} style={{ minWidth: 200 }}>
            {/* Column header */}
            <div style={{
              background: sc.bg, border: `1px solid ${sc.border}`,
              borderRadius: "var(--radius-sm)", padding: "8px 12px",
              marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{col}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {colValue > 0 && (
                  <span style={{ fontSize: 10, color: sc.color, fontWeight: 600 }}>
                    ₹{colValue >= 1000 ? `${(colValue / 1000).toFixed(0)}k` : colValue}
                  </span>
                )}
                <span style={{ fontSize: 11, background: sc.border, color: sc.color, borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}>
                  {colLeads.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {colLeads.map((lead, i) => {
                const pm = PRIORITY_META[lead.priority] || PRIORITY_META.Medium;
                const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                    style={{
                      background: "var(--surface)",
                      border: `1px solid ${isOverdue ? "var(--red)" : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 12px",
                      cursor: "default",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{lead.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: pm.color, background: pm.bg, border: `1px solid ${pm.border}`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {lead.priority}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={10} /> {lead.city}
                      </span>
                      {lead.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--green)" }}>
                          <Phone size={10} /> {lead.phone}
                        </span>
                      )}
                      {!lead.hasWebsite && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--orange)" }}>
                          <WifiOff size={10} /> No website
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {lead.rating > 0 && (
                          <span style={{ fontSize: 10, color: "var(--yellow)", display: "flex", alignItems: "center", gap: 2 }}>
                            <Star size={9} fill="currentColor" /> {lead.rating.toFixed(1)}
                          </span>
                        )}
                        <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>
                          {lead.leadScore}/10
                        </span>
                      </div>
                      {lead.dealValue > 0 && (
                        <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <TrendingUp size={9} /> ₹{lead.dealValue >= 1000 ? `${(lead.dealValue / 1000).toFixed(0)}k` : lead.dealValue}
                        </span>
                      )}
                    </div>

                    {isOverdue && (
                      <div style={{ marginTop: 6, fontSize: 10, color: "var(--red)", fontWeight: 600 }}>
                        ⚠ Follow-up overdue
                      </div>
                    )}

                    {/* Move to next status */}
                    {col !== "Closed" && col !== "Not Interested" && (
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdate(lead.id, "status", e.target.value)}
                        style={{ marginTop: 8, width: "100%", fontSize: 11, padding: "4px 6px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-muted)" }}
                      >
                        {Object.keys(STATUS_COLORS).map((s) => <option key={s}>{s}</option>)}
                      </select>
                    )}
                  </motion.div>
                );
              })}

              {colLeads.length === 0 && (
                <div style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", padding: "20px 0", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)" }}>
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
