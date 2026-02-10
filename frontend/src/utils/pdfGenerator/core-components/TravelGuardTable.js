import autoTable from "jspdf-autotable";
import { COLORS } from "../config";

export const drawTravelGuardTable = (doc, startY) => {
  let y = startY;


  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("DECLARATION:", 15, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0);
  doc.text("I am not traveling to receive medical treatment, diagnosis or consultation.", 15, y);
  y += 10;

 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  doc.text("COVERAGE FOR TRAVEL GUARD", 15, y);
  y += 6;

  const bodyData = [
    ["Currency", "USD", "USD", "USD", "USD", "USD", "USD", "USD"],
    ["Medical Expenses, Hospitalization Abroad & COVID-19", "50,000", "50,000", "25,000", "10,000", "150,000", "100,000", "50,000"],
    ["Transport or Repatriation in case of illness or Accident", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Repatriation of Mortal Remains", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Dental Care", "600", "600", "600", "600", "600", "600", "600"],
    ["Repatriation of Family Member Travelling with Insured", "Actual Expenses", "Actual Expenses", "N/A", "N/A", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Travel of One Immediate Family Member", "100/Day-Max\n1,000", "100/Day-Max\n1,000", "N/A", "N/A", "100/Day-Max\n1,000", "100/Day-Max\n1,000", "100/Day-Max\n1,000"],
    ["Delivery of Medicines", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Relay of Urgent Messages", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
    ["Long Distance Medical Information Service", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
    ["Medical Referral / Appointment of Local Medical Specialist", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
    ["Connections Services", "N/A", "N/A", "N/A", "N/A", "Unlimited", "Unlimited", "N/A"],
    ["Loss Of Credit Card", "500", "300", "200", "200", "2,000", "2,000", "300"],
    ["Delayed Departure", "500", "300", "200", "200", "1,000", "1,000", "300"],
    ["Compression for In-Flight Loss of Checked in Baggage", "500", "400", "400", "300", "1,000", "1,000", "400"],
    ["Accidental Death (During Travel using recognized means of Transport)", "15,000", "10,000", "8,000", "5,000", "25,000", "25,000", "10,000"]
  ];

  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { 
      fontSize: 5, 
      cellPadding: 1.5, 
      halign: "center", 
      valign: "middle", 
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: { 0: { halign: "left", cellWidth: 30, fontStyle: "bold" } },
    headStyles: { fillColor: [0, 102, 153], textColor: 255, fontStyle: "bold", halign: "center", valign: "middle" },
    head: [
      [
        { content: "Schedule of Benefits", rowSpan: 2 },
        { content: "Schengen Countries", colSpan: 2 },
        { content: "Rest of World (Excl. USA, CANADA & AUSTRALIA)", colSpan: 2 },
        { content: "Worldwide", colSpan: 3 },
      ],
      ["Diamond", "Gold", "Silver", "Standard", "Titanium", "Platinum", "Gold Plus"],
    ],
    body: bodyData,
  });

  return doc.lastAutoTable.finalY + 10;
};