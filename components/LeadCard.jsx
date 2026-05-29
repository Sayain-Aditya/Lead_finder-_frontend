"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Tag, Star, Phone, Globe, WifiOff, ChevronDown,
  Briefcase, FileText, Trash2, MessageCircle, Sparkles,
  Copy, Check, Send, TrendingUp, Calendar, PhoneCall,
  Mail, StickyNote, AlertCircle,
} from "lucide-react";
import { STATUS_COLORS, SERVICES, BACKEND, PRIORITY_META, CALL_LOG_TYPES } from "../constants";

const Badge = ({ bg, color, border, icon: Icon, children }) => (
  <span style={{ fontSize: 11, fontWeight: 600, background: bg, color, border: `1px solid ${border}`, borderRadius: 6, padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap", flexShrink: 0 }}>
    {Icon && <Icon size={10} strokeWidth={2.5} />}{children}
  </span>
);

const IconBtn = ({ onClick, title, color = "var(--text-muted)", bg = "var(--surface2)", disabled, children }) => (
  <motion.button onClick={onClick} title={title} disabled={disabled}
    whileHover={!disabled ? { scale: 1.06 } : {}} whileTap={!disabled ? { scale: 0.94 } : {}}
    style={{ background: bg, border: "1px solid var(--border)", borderRadius: 7, padding: "5px 8px", color, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap", flexShrink: 0 }}
  >{children}</motion.button>
);

const LOG_ICONS = { call: PhoneCall, whatsapp: MessageCircle, email: Mail, note: StickyNote };

export default function LeadCard({ lead, onUpdate, onDelete, onAddCallLog, index }) {
  const [isOpen, setIsOpen]                   = useState(false);
  const [activeTab, setActiveTab]             = useState("details");
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [pitchCopied, setPitchCopied]         = useState(false);
  const [logType, setLogType]                 = useState("call");
  const [logMsg, setLogMsg]                   = useState("");

  const sc        = STATUS_COLORS[lead.status] || STATUS_COLORS.New;
  const pm        = PRIORITY_META[lead.priority] || PRIORITY_META.Medium;
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  const openWhatsApp = (e, message) => {
    e?.stopPropagation();
    if (!lead.phone) return;
    const phone = lead.phone.replace(/\D/g, "");
    const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const callPitchAPI = async () => {
    const res = await fetch(`${BACKEND}/pitch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, category: lead.category, city: lead.city, hasWebsite: lead.hasWebsite, rating: lead.rating, service: lead.service }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.pitch;
  };

  const generateAndSend = async (e) => {
    e.stopPropagation();
    setGeneratingPitch(true);
    if (!isOpen) setIsOpen(true);
    try {
      const pitch = await callPitchAPI();
      onUpdate(lead.id, "pitch", pitch);
      openWhatsApp(null, pitch);
    } catch { onUpdate(lead.id, "pitch", "Failed to generate pitch."); }
    setGeneratingPitch(false);
  };

  const generatePitch = async (e) => {
    e.stopPropagation();
    setGeneratingPitch(true);
    if (!isOpen) { setIsOpen(true); setActiveTab("pitch"); }
    try {
      const pitch = await callPitchAPI();
      onUpdate(lead.id, "pitch", pitch);
    } catch { onUpdate(lead.id, "pitch", "Failed to generate pitch."); }
    setGeneratingPitch(false);
  };

  const copyPitch = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(lead.pitch);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  };

  const submitLog = () => {
    if (!logMsg.trim()) return;
    onAddCallLog(lead.id, { type: logType, message: logMsg });
    setLogMsg("");
  };

  const TABS = ["details", "pitch", "calllog"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      whileHover={{ borderColor: isOverdue ? "var(--red)" : "var(--border-hover)" }}
      style={{ background: "rgba(255,253,248,0.9)", border: `1px solid ${isOverdue ? "rgba(163,74,64,0.45)" : "var(--border)"}`, borderRadius: "var(--radius)", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: "0 10px 28px rgba(50,43,32,0.06)" }}
    >
      <div onClick={() => setIsOpen((o) => !o)} style={{ padding: "12px 14px", cursor: "pointer" }}>
        {/* Row 1: name + badges */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", wordBreak: "break-word" }}>{lead.name}</span>
            <Badge bg={pm.bg} color={pm.color} border={pm.border}>{lead.priority}</Badge>
            {!lead.hasWebsite && <Badge bg="var(--orange-dim)" color="var(--orange)" border="rgba(154,91,32,0.22)" icon={WifiOff}>No website</Badge>}
            {isOverdue && <Badge bg="var(--red-dim)" color="var(--red)" border="rgba(163,74,64,0.22)" icon={AlertCircle}>Due</Badge>}
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, marginTop: 2 }}>
            <ChevronDown size={15} color="var(--text-dim)" />
          </motion.div>
        </div>

        {/* Row 2: meta */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} /> {lead.city}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Tag size={11} /> {lead.category}</span>
          {lead.phone && <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--green)" }}><Phone size={11} /> {lead.phone}</span>}
          {lead.rating > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--yellow)" }}><Star size={11} fill="currentColor" /><span style={{ color: "var(--text-muted)" }}>{lead.rating.toFixed(1)}</span></span>}
          <span style={{ fontWeight: 700, fontSize: 11, color: lead.leadScore >= 7 ? "var(--green)" : lead.leadScore >= 4 ? "var(--yellow)" : "var(--red)" }}>{lead.leadScore}/10</span>
          {lead.dealValue > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--green)", fontWeight: 600 }}><TrendingUp size={11} /> ₹{lead.dealValue >= 1000 ? `${(lead.dealValue / 1000).toFixed(0)}k` : lead.dealValue}</span>}
        </div>

        {/* Row 3: actions */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {lead.phone && (
            <IconBtn onClick={lead.pitch ? (e) => openWhatsApp(e, lead.pitch) : generateAndSend}
              title={lead.pitch ? "Send pitch via WhatsApp" : "Generate & send via WhatsApp"}
              color="var(--green)" bg="var(--green-dim)" disabled={generatingPitch}>
              {generatingPitch ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles size={12} /></motion.div> : <MessageCircle size={12} />}
              {generatingPitch ? "Generating…" : lead.pitch ? "Send WhatsApp" : "WhatsApp Pitch"}
            </IconBtn>
          )}
          <IconBtn onClick={generatePitch} title="Generate AI pitch" color="var(--accent)" bg="var(--accent-dim)" disabled={generatingPitch}>
            <motion.div animate={generatingPitch ? { rotate: 360 } : {}} transition={generatingPitch ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}><Sparkles size={12} /></motion.div>
            {generatingPitch ? "Writing…" : lead.pitch ? "Regenerate" : "AI Pitch"}
          </IconBtn>
          <select value={lead.status} onChange={(e) => { e.stopPropagation(); onUpdate(lead.id, "status", e.target.value); }}
            style={{ width: "auto", fontSize: 11, fontWeight: 600, padding: "5px 8px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 6, flexShrink: 0 }}>
            {Object.keys(STATUS_COLORS).map((s) => <option key={s}>{s}</option>)}
          </select>
          <motion.button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: "4px", flexShrink: 0, marginLeft: "auto" }}>
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                {TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ flex: 1, padding: "10px 4px", fontSize: 12, fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: activeTab === tab ? "var(--accent)" : "var(--text-muted)", borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent", textTransform: "capitalize", transition: "color 0.2s" }}>
                    {tab === "calllog" ? "Call Log" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
                {/* DETAILS TAB */}
                {activeTab === "details" && (
                  <>
                    <div className="lead-detail-grid">
                      <div className="lead-detail-field">
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><Briefcase size={10} /> Service</div>
                        <select value={lead.service} onChange={(e) => onUpdate(lead.id, "service", e.target.value)} style={{ fontSize: 12, padding: "7px 10px" }}>
                          <option value="">Select…</option>
                          {SERVICES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="lead-detail-field">
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Priority</div>
                        <select value={lead.priority || "Medium"} onChange={(e) => onUpdate(lead.id, "priority", e.target.value)}
                          style={{ fontSize: 12, padding: "7px 10px", background: pm.bg, color: pm.color, border: `1px solid ${pm.border}`, borderRadius: "var(--radius-sm)" }}>
                          {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="lead-detail-field">
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={10} /> Deal (₹)</div>
                        <input type="number" value={lead.dealValue || ""} onChange={(e) => onUpdate(lead.id, "dealValue", Number(e.target.value))} placeholder="e.g. 25000" style={{ fontSize: 12, padding: "7px 10px" }} />
                      </div>
                      <div className="lead-detail-field">
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><Calendar size={10} /> Follow-up</div>
                        <input type="date" value={lead.followUpDate ? new Date(lead.followUpDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => onUpdate(lead.id, "followUpDate", e.target.value || null)}
                          style={{ fontSize: 12, padding: "7px 10px", colorScheme: "light", borderColor: isOverdue ? "var(--red)" : undefined }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><Globe size={10} /> Website</div>
                      <div style={{ fontSize: 13 }}>
                        {lead.website
                          ? <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none", wordBreak: "break-all" }}>{lead.website}</a>
                          : <span style={{ color: "var(--orange)", fontStyle: "italic", display: "flex", alignItems: "center", gap: 5 }}><WifiOff size={12} /> No website — great prospect!</span>}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><FileText size={10} /> Notes</div>
                      <textarea rows={2} value={lead.notes} onChange={(e) => onUpdate(lead.id, "notes", e.target.value)} placeholder="Add notes…" style={{ fontSize: 13, padding: "9px 10px", resize: "vertical" }} />
                    </div>
                  </>
                )}

                {/* PITCH TAB */}
                {activeTab === "pitch" && (
                  <div>
                    {(lead.pitch || generatingPitch) ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}><Sparkles size={11} color="var(--accent)" /> AI Pitch</span>
                          {lead.pitch && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <motion.button onClick={copyPitch} whileHover={{ scale: 1.05 }} style={{ background: "none", border: "none", cursor: "pointer", color: pitchCopied ? "var(--green)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600 }}>
                                {pitchCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                              </motion.button>
                              {lead.phone && (
                                <motion.button onClick={(e) => openWhatsApp(e, lead.pitch)} whileHover={{ scale: 1.05 }}
                                  style={{ background: "var(--green-dim)", border: "1px solid rgba(31,111,101,0.22)", borderRadius: 6, cursor: "pointer", color: "var(--green)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "3px 8px" }}>
                                  <Send size={11} /> Send via WhatsApp
                                </motion.button>
                              )}
                            </div>
                          )}
                        </div>
                        {generatingPitch
                          ? <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", padding: "10px 12px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>Writing your pitch…</div>
                          : <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, padding: "12px", background: "var(--surface)", border: "1px solid rgba(31,111,101,0.18)", borderRadius: "var(--radius-sm)", whiteSpace: "pre-wrap" }}>{lead.pitch}</div>}
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>No pitch generated yet</div>
                        <IconBtn onClick={generatePitch} color="var(--accent)" bg="var(--accent-dim)" disabled={generatingPitch}>
                          <Sparkles size={13} /> Generate AI Pitch
                        </IconBtn>
                      </div>
                    )}
                  </div>
                )}

                {/* CALL LOG TAB */}
                {activeTab === "calllog" && (
                  <div>
                    <div className="calllog-input-row">
                      <select value={logType} onChange={(e) => setLogType(e.target.value)} className="calllog-type-select">
                        {Object.entries(CALL_LOG_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                      <input value={logMsg} onChange={(e) => setLogMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitLog()}
                        placeholder="Log a call, message or note…" className="calllog-msg-input" style={{ fontSize: 13, padding: "8px 10px" }} />
                      <motion.button onClick={submitLog} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        style={{ padding: "8px 14px", background: "var(--accent)", color: "#fffdf8", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                        Add
                      </motion.button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(lead.callLog || []).length === 0 ? (
                        <div style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", padding: "1.5rem 0" }}>No activity logged yet</div>
                      ) : (
                        [...(lead.callLog || [])].reverse().map((entry, i) => {
                          const LogIcon   = LOG_ICONS[entry.type] || StickyNote;
                          const typeColor = CALL_LOG_TYPES[entry.type]?.color || "var(--text-muted)";
                          return (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                              style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${typeColor}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <LogIcon size={12} color={typeColor} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.4, wordBreak: "break-word" }}>{entry.message}</div>
                                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
                                  {new Date(entry.date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
