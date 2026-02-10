import autoTable from "jspdf-autotable";
import { COLORS, LAYOUT, FONTS } from "../config";

export const drawReportsTable = (doc, startY, reportData, summary) => {
  const pageHeight = doc.internal.pageSize.getHeight();

  
  const totalPaidAmount = summary?.totalPaidAmount || 0;

  
  const tableData = reportData.map((item) => [
    item.policyNo || "",
    item.insuredName || "",
    item.issueDate || "",
    item.expiryDate || "",
    item.country || "",
    item.package || "",
    item.covid ? "YES" : "NO",
    `Rs ${item.amount?.toLocaleString() || "0"}`,
  ]);


  autoTable(doc, {
    startY: startY,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: "left",
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [200, 200, 200],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 }, 
      2: { cellWidth: 28 }, 
      3: { cellWidth: 28 }, 
      4: { cellWidth: 20 },
      5: { cellWidth: 22 }, 
      6: { cellWidth: 12, halign: "center" },
      7: { cellWidth: 15, halign: "right" }, 
    },
    headStyles: {
      fillColor: [0, 102, 153],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      fontSize: 9,
    },
    head: [
      [
        "Policy No",
        "Insured Name",
        "Issue Date",
        "Expiry Date",
        "Country",
        "Package",
        "Covid",
        "Amount",
      ],
    ],
    body: tableData,
    foot: [
      [
        {
          content: `TOTAL PAID AMOUNT: Rs ${totalPaidAmount.toLocaleString()}`,
          colSpan: 8,
          styles: { halign: "right", fontStyle: "bold" },
        },
      ],
    ],
    footStyles: {
      fillColor: [0, 102, 153],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    didParseCell: function (data) {
     
      if (data.column.index === 6 && data.section === "body") {
        const cellValue = data.cell.raw;
        if (cellValue === "YES") {
          data.cell.styles.textColor = [0, 128, 0];
        } else if (cellValue === "NO") {
          data.cell.styles.textColor = [255, 0, 0];
        }
      }
    },
  });

  return doc.lastAutoTable.finalY + 5; 
};
