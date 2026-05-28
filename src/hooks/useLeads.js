import { useState, useEffect } from "react";
import { BACKEND, CATEGORIES } from "../constants";

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  // Load all leads from DB on mount
  useEffect(() => {
    fetch(`${BACKEND}/leads`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data.map(normalise));
      })
      .catch(() => {});
  }, []);

  // MongoDB _id → id, keep rest
  const normalise = (l) => ({ ...l, id: l._id || l.id });

  const updateLead = async (id, field, val) => {
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, [field]: val } : x)));
    try {
      await fetch(`${BACKEND}/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: val }),
      });
    } catch {}
  };

  const deleteLead = async (id) => {
    setLeads((l) => l.filter((x) => x.id !== id));
    try {
      await fetch(`${BACKEND}/leads/${id}`, { method: "DELETE" });
    } catch {}
  };

  const clearAllLeads = async () => {
    setLeads([]);
    try {
      await fetch(`${BACKEND}/leads`, { method: "DELETE" });
    } catch {}
  };

  const searchLeads = async () => {
    if (!city.trim()) { setError("Please enter a city name."); return; }
    setLoading(true);
    setError("");

    try {
      setLoadingMsg("Finding city location…");
      const geoRes = await fetch(`${BACKEND}/geocode?city=${encodeURIComponent(city)}`);
      if (!geoRes.ok) { const e = await geoRes.json(); throw new Error(e.error); }
      const { lat, lng } = await geoRes.json();

      setLoadingMsg(`Searching ${category.toLowerCase()}s in ${city}…`);
      const searchRes = await fetch(
        `${BACKEND}/search?lat=${lat}&lng=${lng}&keyword=${encodeURIComponent(category)}`
      );
      if (!searchRes.ok) { const e = await searchRes.json(); throw new Error(e.error); }
      const places = await searchRes.json();

      if (!places.length) {
        setError(`No results found in ${city}. Try a different category.`);
        setLoading(false);
        return;
      }

      const newLeads = [];
      for (let i = 0; i < places.length; i++) {
        const p = places[i];
        setLoadingMsg(`Getting details ${i + 1} of ${places.length}…`);
        let phone = "", website = "", address = p.vicinity || "";
        try {
          const detRes = await fetch(`${BACKEND}/details?place_id=${p.place_id}`);
          const det = await detRes.json();
          phone = det.formatted_phone_number || "";
          website = det.website || "";
          address = det.formatted_address || address;
        } catch {}

        const isDup = leads.some((x) => x.name === p.name && x.city === city);
        if (!isDup && p.name) {
          newLeads.push({
            name: p.name, category, city, address,
            phone, website,
            rating: p.rating || 0,
            hasWebsite: !!website,
            status: "New", notes: "", service: "", pitch: "",
          });
        }
      }

      if (newLeads.length) {
        // Save to DB, get back docs with _id
        const saveRes = await fetch(`${BACKEND}/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leads: newLeads }),
        });
        const { saved } = await saveRes.json();

        // Reload from DB to get proper _id fields
        const allRes = await fetch(`${BACKEND}/leads`);
        const allLeads = await allRes.json();
        setLeads(allLeads.map(normalise));

        if (saved === 0) setError("All results are already in your list.");
      } else {
        setError("All results are already in your list.");
      }
    } catch (e) {
      setError(
        e.message.includes("fetch")
          ? `Cannot connect to backend at ${BACKEND}`
          : e.message
      );
    }

    setLoading(false);
    setLoadingMsg("");
  };

  return {
    leads, city, setCity, category, setCategory,
    loading, loadingMsg, error,
    searchLeads, updateLead, deleteLead, clearAllLeads,
  };
};
