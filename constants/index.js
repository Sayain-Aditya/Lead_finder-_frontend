export const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const STATUS_COLORS = {
  New:              { bg: "rgba(61,98,120,0.09)",   color: "var(--blue)",   border: "rgba(61,98,120,0.2)"  },
  Contacted:        { bg: "rgba(138,106,31,0.09)",  color: "var(--yellow)", border: "rgba(138,106,31,0.2)" },
  Interested:       { bg: "rgba(31,111,101,0.1)",   color: "var(--green)",  border: "rgba(31,111,101,0.2)" },
  Closed:           { bg: "rgba(31,111,101,0.14)",  color: "var(--accent)", border: "rgba(31,111,101,0.24)" },
  "Not Interested": { bg: "rgba(163,74,64,0.09)",   color: "var(--red)",    border: "rgba(163,74,64,0.2)"  },
};

export const PRIORITY_META = {
  High:   { color: "var(--red)",    bg: "var(--red-dim)",    border: "rgba(163,74,64,0.22)",  label: "High"   },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(138,106,31,0.22)", label: "Medium" },
  Low:    { color: "var(--green)",  bg: "var(--green-dim)",  border: "rgba(31,111,101,0.22)", label: "Low"    },
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
  { key: "total",     label: "Total Leads",    color: "var(--accent)", glow: "rgba(31,111,101,0.1)" },
  { key: "noWebsite", label: "No Website",     color: "var(--orange)", glow: "rgba(154,91,32,0.1)" },
  { key: "pipeline",  label: "Pipeline Value", color: "var(--blue)",   glow: "rgba(61,98,120,0.1)" },
  { key: "closed",    label: "Deals Closed",   color: "var(--green)",  glow: "rgba(31,111,101,0.1)" },
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
