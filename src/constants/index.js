export const BACKEND = "http://localhost:3001";

export const STATUS_COLORS = {
  New:             { bg: "var(--blue-dim)",   color: "var(--blue)",   border: "rgba(59,130,246,0.3)"  },
  Contacted:       { bg: "var(--yellow-dim)", color: "var(--yellow)", border: "rgba(234,179,8,0.3)"   },
  Interested:      { bg: "var(--green-dim)",  color: "var(--green)",  border: "rgba(34,197,94,0.3)"   },
  Closed:          { bg: "var(--accent-dim)", color: "var(--accent)", border: "rgba(108,99,255,0.3)"  },
  "Not Interested":{ bg: "var(--red-dim)",    color: "var(--red)",    border: "rgba(239,68,68,0.3)"   },
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
  { key: "total",     label: "Total Leads",  color: "var(--accent)", glow: "rgba(108,99,255,0.2)"  },
  { key: "noWebsite", label: "No Website",   color: "var(--orange)", glow: "rgba(249,115,22,0.2)"  },
  { key: "contacted", label: "In Pipeline",  color: "var(--blue)",   glow: "rgba(59,130,246,0.2)"  },
  { key: "closed",    label: "Deals Closed", color: "var(--green)",  glow: "rgba(34,197,94,0.2)"   },
];
