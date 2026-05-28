import * as XLSX from "xlsx";

export const exportExcel = (leads) => {
  const rows = leads.map((l) => ({
    Name: l.name,
    Category: l.category,
    City: l.city,
    Phone: l.phone,
    Website: l.website || "None",
    Rating: l.rating,
    Status: l.status,
    Service: l.service,
    Notes: l.notes,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.writeFile(wb, "leads.xlsx");
};
