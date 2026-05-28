import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Tag, Star, Phone, Globe, WifiOff,
  ChevronDown, Briefcase, FileText, Trash2,
  MessageCircle, Sparkles, Copy, Check, Send,
} from "lucide-react";
import { STATUS_COLORS, SERVICES, BACKEND } from "../constants";

const Badge = ({ bg, color, border, icon: Icon, children }) => (
  <span style={{
    fontSize: 11, fontWeight: 600,
    background: bg, color, border: `1px solid ${border}`,
    borderRadius: 6, padding: "3px 9px",
    display: "inline-flex", alignItems: "center", gap: 4,
    whiteSpace: "nowrap",
  }}>
    {Icon && <Icon size={11} strokeWidth={2.5} />}
    {children}
  </span>
);

const IconBtn = ({ onClick, title, color = "var(--text-muted)", bg = "var(--surface2)", disabled, children }) => (
  <motion.button
    onClick={onClick}
    title={title}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.08 } : {}}
    whileTap={!disabled ? { scale: 0.93 } : {}}
    style={{
      background: bg, border: "1px solid var(--border)",
      borderRadius: 8, padding: "6px 10px",
      color, cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 600,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {children}
  </motion.button>
);

export default function LeadCard({ lead, onUpdate, onDelete, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);
  const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.New;
  const stars = Math.round(lead.rating);

  // Open WhatsApp with the AI pitch (or fallback if no pitch yet)
  const openWhatsApp = (e, message) => {
    e?.stopPropagation();
    if (!lead.phone) return;
    const phone = lead.phone.replace(/\D/g, "");
    // Add country code 91 for India if not present
    const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, "_blank");
  };

  // Generate AI pitch then immediately open WhatsApp with it
  const generateAndSend = async (e) => {
    e.stopPropagation();
    setGeneratingPitch(true);
    if (!isOpen) setIsOpen(true);
    try {
      const res = await fetch(`${BACKEND}/pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       lead.name,
          category:   lead.category,
          city:       lead.city,
          hasWebsite: lead.hasWebsite,
          rating:     lead.rating,
          service:    lead.service,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Save pitch to lead
      onUpdate(lead.id, "pitch", data.pitch);
      // Open WhatsApp with the generated pitch
      openWhatsApp(null, data.pitch);
    } catch (err) {
      onUpdate(lead.id, "pitch", "Failed to generate pitch. Please try again.");
    }
    setGeneratingPitch(false);
  };

  // Just generate pitch without opening WhatsApp
  const generatePitch = async (e) => {
    e.stopPropagation();
    setGeneratingPitch(true);
    if (!isOpen) setIsOpen(true);
    try {
      const res = await fetch(`${BACKEND}/pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       lead.name,
          category:   lead.category,
          city:       lead.city,
          hasWebsite: lead.hasWebsite,
          rating:     lead.rating,
          service:    lead.service,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpdate(lead.id, "pitch", data.pitch);
    } catch (err) {
      onUpdate(lead.id, "pitch", "Failed to generate pitch. Please try again.");
    }
    setGeneratingPitch(false);
  };

  const copyPitch = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(lead.pitch);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      whileHover={{ borderColor: "var(--border-hover)" }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header row */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{lead.name}</span>
            {!lead.hasWebsite && (
              <Badge bg="var(--orange-dim)" color="var(--orange)" border="rgba(249,115,22,0.3)" icon={WifiOff}>
                No website
              </Badge>
            )}
            {lead.phone && (
              <Badge bg="var(--green-dim)" color="var(--green)" border="rgba(34,197,94,0.3)" icon={Phone}>
                {lead.phone}
              </Badge>
            )}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} strokeWidth={2} /> {lead.city}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Tag size={12} strokeWidth={2} /> {lead.category}
            </span>
            {lead.rating > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--yellow)" }}>
                <Star size={12} strokeWidth={2} fill="currentColor" />
                <span style={{ color: "var(--text-muted)" }}>{lead.rating.toFixed(1)}</span>
              </span>
            )}
            {lead.address && (
              <span style={{ color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
                {lead.address}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>

          {/* WhatsApp + AI pitch in one click */}
          {lead.phone && (
            <IconBtn
              onClick={lead.pitch ? (e) => openWhatsApp(e, lead.pitch) : generateAndSend}
              title={lead.pitch ? "Send AI pitch via WhatsApp" : "Generate AI pitch & send via WhatsApp"}
              color="#22c55e"
              bg="var(--green-dim)"
              disabled={generatingPitch}
            >
              {generatingPitch ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles size={13} />
                </motion.div>
              ) : (
                <MessageCircle size={13} />
              )}
              {generatingPitch ? "Generating…" : lead.pitch ? "Send on WhatsApp" : "WhatsApp Pitch"}
            </IconBtn>
          )}

          {/* Regenerate pitch only */}
          <IconBtn
            onClick={generatePitch}
            title="Generate AI pitch"
            color="var(--accent)"
            bg="var(--accent-dim)"
            disabled={generatingPitch}
          >
            <motion.div
              animate={generatingPitch ? { rotate: 360 } : { rotate: 0 }}
              transition={generatingPitch ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            >
              <Sparkles size={13} />
            </motion.div>
            {generatingPitch ? "Writing…" : lead.pitch ? "Regenerate" : "AI Pitch"}
          </IconBtn>

          <select
            value={lead.status}
            onChange={(e) => { e.stopPropagation(); onUpdate(lead.id, "status", e.target.value); }}
            style={{
              fontSize: 12, fontWeight: 600,
              padding: "5px 10px",
              background: sc.bg, color: sc.color,
              border: `1px solid ${sc.border}`,
              borderRadius: 6,
            }}
          >
            {Object.keys(STATUS_COLORS).map((s) => <option key={s}>{s}</option>)}
          </select>

          <motion.button
            onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete lead"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 4 }}
          >
            <Trash2 size={15} />
          </motion.button>

          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={16} color="var(--text-dim)" />
          </motion.div>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: "1px solid var(--border)",
              padding: "16px 18px",
              background: "var(--surface2)",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                    <Briefcase size={11} /> Service to pitch
                  </div>
                  <select
                    value={lead.service}
                    onChange={(e) => onUpdate(lead.id, "service", e.target.value)}
                    style={{ fontSize: 13, width: "100%", padding: "8px 12px" }}
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                    <Globe size={11} /> Website
                  </div>
                  <div style={{ fontSize: 13, paddingTop: 4 }}>
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noreferrer"
                        style={{ color: "var(--accent)", textDecoration: "none", wordBreak: "break-all" }}
                        onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                      >
                        {lead.website}
                      </a>
                    ) : (
                      <span style={{ color: "var(--orange)", fontStyle: "italic", display: "flex", alignItems: "center", gap: 5 }}>
                        <WifiOff size={13} /> No website — great prospect!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Pitch output */}
              {(lead.pitch || generatingPitch) && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Sparkles size={11} color="var(--accent)" /> AI Generated Pitch
                    </span>
                    {lead.pitch && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <motion.button
                          onClick={copyPitch}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: pitchCopied ? "var(--green)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600 }}
                        >
                          {pitchCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                        </motion.button>
                        {/* Send via WhatsApp from pitch panel */}
                        {lead.phone && (
                          <motion.button
                            onClick={(e) => openWhatsApp(e, lead.pitch)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            style={{ background: "var(--green-dim)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 6, cursor: "pointer", color: "var(--green)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px" }}
                          >
                            <Send size={11} /> Send via WhatsApp
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                  {generatingPitch ? (
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                      Writing your pitch…
                    </div>
                  ) : (
                    <div style={{
                      fontSize: 13, color: "var(--text)", lineHeight: 1.7,
                      padding: "12px 14px",
                      background: "var(--surface)",
                      border: "1px solid rgba(108,99,255,0.2)",
                      borderRadius: "var(--radius-sm)",
                      whiteSpace: "pre-wrap",
                    }}>
                      {lead.pitch}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                  <FileText size={11} /> Notes
                </div>
                <textarea
                  rows={2}
                  value={lead.notes}
                  onChange={(e) => onUpdate(lead.id, "notes", e.target.value)}
                  placeholder="Add notes about this lead…"
                  style={{ width: "100%", fontSize: 13, padding: "10px 12px", resize: "vertical" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
