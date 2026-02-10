import autoTable from "jspdf-autotable";
import { COLORS } from "../config";

export const drawStudentPlanTable = (doc, startY) => {
  let y = startY;

  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  doc.text("PLANS (Limit in USD)", 15, y);
  y += 6;

  const bodyData = [
    ["Medical Expenses for Sickness & hospitalization Abroad", "150,000 (Excess $ 150)", "50,000 (Excess $ 150)", "100,000 (Excess $ 150)"],
    ["Emergency Dental Care", "1,000", "1,000", "1,000"],
    ["Travel of One Immediate Family Member", "5,000", "5,000", "5,000"],
    ["Repatriation of Mortal Remains", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Transport or Repatriation in case of Illness or Accident", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Loss of Passport", "300", "300", "300"],
    ["Loss In-Flight Lost of Checked in Baggage", "500", "500", "500"],
    ["Accidental Death", "100% of Principal Sum\nInsured", "100% of Principal Sum\nInsured", "100% of Principal Sum\nInsured"],
    ["Permanent Total Disability", "100% of Principal Sum\nInsured", "100% of Principal Sum\nInsured", "100% of Principal Sum\nInsured"]
  ];

  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { 
      fontSize: 6, 
      cellPadding: 2, 
      halign: "center", 
      valign: "middle", 
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: { 0: { halign: "left", cellWidth: 60, fontStyle: "bold" } },
    headStyles: { fillColor: [0, 102, 153], textColor: 255, fontStyle: "bold", halign: "center" },
    head: [
      [
        { content: "Schedule of Benefits", rowSpan: 2, styles: { valign: "middle" } },
        { content: "Plans (Limit in USD)", colSpan: 3, styles: { halign: "center" } }
      ],
      ["Sapphire Elite (USD)", "Sapphire (USD)", "Sapphire Plus (USD)"]
    ],
    body: bodyData,
  });

  return doc.lastAutoTable.finalY + 10;
};