import autoTable from "jspdf-autotable";
import { COLORS } from "../config";

export const drawDisclaimers = (doc, startY) => {
  let y = startY;

  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Note: Excess/deductible of each & every claim:", 15, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 7, halign: "center", cellPadding: 2, lineColor: [200, 200, 200] },
    headStyles: { fillColor: COLORS.secondaryBg, textColor: 0, fontStyle: "bold" },
    head: [["", "0-70 Years", "71-85 Years", "86-90 Years"]],
    body: [["USD", "100", "150", "300"]],
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("* Pre-existing conditions are not covered.", 15, y);
  y += 4;
  doc.text("Excluding Countries: Afghanistan, Cuba, Israel, Pakistan", 15, y);
  y += 8;
  
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    "This Policy shall be deemed to be issued as an electronic document. Any print out is for record only.", 
    15, y, { maxWidth: 180 }
  );

  return y;
};