import autoTable from "jspdf-autotable";
import { COLORS } from "../config";
import { safeStr } from "../helpers/formatters";

import { getAllSchengenPackages } from "../../../api/schengenPackage";
import { getAllRestOfWorldPackages } from "../../../api/restOfWorld";
import { getAllStudentPackages } from "../../../api/studentPackage";
import { getAllWorldWidePackages } from "../../../api/worldWidePackages";

const PACKAGE_API_MAP = {
  schengen: { fn: getAllSchengenPackages, title: "Schengen Countries", currency: "$50,000", hasFamily: true },
  "rest-of-world": { fn: getAllRestOfWorldPackages, title: "Rest of World", currency: "$10,000", hasFamily: true },
  worldwide: { fn: getAllWorldWidePackages, title: "Worldwide", currency: "Various Limits", hasFamily: true },
  "student-plan": { fn: getAllStudentPackages, title: "Student Plan", currency: "Various Limits", hasFamily: false },
};

export const fetchAndDrawPlanTables = async (doc, startY, checkBreak) => {
  let y = startY;

  for (const [key, config] of Object.entries(PACKAGE_API_MAP)) {
    try {
      const res = await config.fn();
      const packages = res?.packages || res?.data || res || [];
      if (!packages.length) continue;

     
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.primary);
      doc.text(`${config.title} Premium (${config.currency})`, 15, y);
      y += 6;

      const firstPkg = packages[0];

      if (config.hasFamily) {
     

   
        const planNames = Array.from(
          new Set(
            Object.keys(firstPkg)
              .filter(k => !["duration", "maxStay", "id", "_id", "createdAt", "updatedAt", "notes", "__v"].includes(k))
              .map(k => k.replace(/Single|Family/g, "")) 
          )
        );

 
        const topHeader = [
          { content: "Duration", rowSpan: 2, styles: { halign: "center", valign: "middle", fontStyle: "bold" } },
          { content: "Max Stay", rowSpan: 2, styles: { halign: "center", valign: "middle", fontStyle: "bold" } },
          ...planNames.map(name => ({
            content: name.toUpperCase(),
            colSpan: 2,
            styles: { halign: "center", fontStyle: "bold" }
          }))
        ];

        const subHeader = planNames.flatMap(() => [
          { content: "Single", styles: { halign: "center", fontStyle: "bold" } },
          { content: "Family", styles: { halign: "center", fontStyle: "bold" } }
        ]);

      
        const body = packages.map(pkg => {
          const row = [safeStr(pkg.duration), safeStr(pkg.maxStay)];
          planNames.forEach(name => {
            row.push(safeStr(pkg[name + "Single"]));
            row.push(safeStr(pkg[name + "Family"]));
          });
          return row;
        });

        autoTable(doc, {
          startY: y,
          theme: "grid",
          head: [topHeader, subHeader],
          body: body,
          headStyles: { fillColor: COLORS.primary, textColor: 255, fontSize: 8, halign: "center", valign: "middle" },
          styles: { fontSize: 8, cellPadding: 2, halign: "center", valign: "middle", lineWidth: 0.1 },
          margin: { left: 15, right: 15 },
        });

      } else {
       
        const planKeys = Object.keys(firstPkg).filter(
          k => !["duration", "maxStay", "id", "_id", "createdAt", "updatedAt", "notes", "__v"].includes(k)
        );

     
        const header = [
          { content: "Duration", styles: { halign: "center", fontStyle: "bold" } },
          { content: "Max Stay", styles: { halign: "center", fontStyle: "bold" } },
          ...planKeys.map(k => ({ content: k.toUpperCase(), styles: { halign: "center", fontStyle: "bold" } }))
        ];

     
        const body = packages.map(pkg => [safeStr(pkg.duration), safeStr(pkg.maxStay), ...planKeys.map(k => safeStr(pkg[k]))]);

        autoTable(doc, {
          startY: y,
          theme: "grid",
          head: [header],
          body: body,
          headStyles: { fillColor: COLORS.primary, textColor: 255, fontSize: 8, halign: "center", valign: "middle" },
          styles: { fontSize: 8, cellPadding: 2, halign: "center", valign: "middle", lineWidth: 0.1 },
          margin: { left: 15, right: 15 },
        });
      }

      y = doc.lastAutoTable.finalY + 10;
      y = checkBreak(doc, y);

    } catch (err) {
      console.error(`Error loading ${key}`, err);
    }
  }

  return y;
};
