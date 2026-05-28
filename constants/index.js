export const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const STATUS_COLORS = {
  New:             { bg: "var(--blue-dim)",   color: "var(--blue)",   border: "rgba(59,130,246,0.3)"  },
  Contacted:       { bg: "var(--yellow-dim)", color: "var(--yellow)", border: "rgba(234,179,8,0.3)"   },
  Interested:      { bg: "var(--green-dim)",  color: "var(--green)",  border: "rgba(34,197,94,0.3)"   },
  Closed:          { bg: "var(--accent-dim)", color: "var(--accent)", border: "rgba(108,99,255,0.3)"  },
  "Not Interested":{ bg: "var(--red-dim)",    color: "var(--red)",    border: "rgba(239,68,68,0.3)"   },
};

export const PRIORITY_META = {
  High:   { color: "var(--red)",    bg: "var(--red-dim)",    border: "rgba(239,68,68,0.3)",   label: "High"   },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(234,179,8,0.3)",   label: "Medium" },
  Low:    { color: "var(--green)",  bg: "var(--green-dim)",  border: "rgba(34,197,94,0.3)",   label: "Low"    },
};

export const CALL_LOG_TYPES = {
  call:     { label: "Call",     color: "var(--blue)"   },
  whatsapp: { label: "WhatsApp", color: "var(--green)"  },
  email:    { label: "Email",    color: "var(--accent)" },
  note:     { label: "Note",     color: "var(--yellow)" },
};

export const SERVICES = [
  "Website",
  "SEO / Online presence",
  "Custom software",
  "Social media setup",
  "All services",
];

export const CATEGORIES = [
  "Restaurant",
  "Hotel",
  "Banquet hall",
  "Cafe",
  "Resort",
  "Bar / Pub",
];

export const STAT_META = [
  { key: "total",     label: "Total Leads",    color: "var(--accent)", glow: "rgba(108,99,255,0.2)" },
  { key: "noWebsite", label: "No Website",     color: "var(--orange)", glow: "rgba(249,115,22,0.2)" },
  { key: "pipeline",  label: "Pipeline Value", color: "var(--blue)",   glow: "rgba(59,130,246,0.2)" },
  { key: "closed",    label: "Deals Closed",   color: "var(--green)",  glow: "rgba(34,197,94,0.2)"  },
];

export const KANBAN_COLUMNS = ["New", "Contacted", "Interested", "Closed", "Not Interested"];

export const calcLeadScore = (lead) => {
  let score = 0;
  if (!lead.hasWebsite)  score += 3;
  if (lead.phone)        score += 2;
  if (lead.rating >= 4)  score += 2;
  else if (lead.rating >= 3) score += 1;
  if (lead.category === "Hotel" || lead.category === "Resort") score += 1;
  if (lead.address)      score += 1;
  return Math.min(score, 10);
};
