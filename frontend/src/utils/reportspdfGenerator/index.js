import jsPDF from "jspdf";
import { drawFooter } from "../pdfGenerator/core-components/Footer";
import { drawReportsTable } from "../pdfGenerator/core-components/ReportsTable";
import { COLORS, LAYOUT, FONTS } from "../pdfGenerator/config";
import spsLogo from "../../assets/splogo.png";

export const generateReportsPDF = async ({
  reportData,
  summary,
  dateRange,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

 
  let currentY = drawReportHeader(doc, dateRange, pageWidth);

 
  currentY = drawReportsTable(doc, currentY, reportData, summary);


  if (summary) {
    drawSummary(doc, currentY, summary, pageWidth, pageHeight);
  }

 
  drawFooter(doc);

 
  doc.save(`Policy_Report_${dateRange.from}_to_${dateRange.to}.pdf`);

  return Promise.resolve();
};


const drawReportHeader = (doc, dateRange, pageWidth) => {
  const centerX = pageWidth / 2;


  doc.setFontSize(9);
  doc.setTextColor(0);
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${now.getFullYear()} - ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  doc.text(formattedDate, LAYOUT.marginX, 6);


  const imgProps = doc.getImageProperties(spsLogo);
  const logoWidth = 25;
  const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
  const logoX = 30;
  doc.addImage(spsLogo, "PNG", logoX, 8, logoWidth, logoHeight);

  
  doc.setFontSize(16);
  doc.setFont(FONTS.main, FONTS.bold);
  doc.setTextColor(...COLORS.primary);
  doc.text("SecurPath Solution (SPS)", centerX, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont(FONTS.main, FONTS.normal);
  doc.setTextColor(...COLORS.textLight);
  doc.text("A Member Company of United International Group", centerX, 24, {
    align: "center",
  });

 
  const barY = 35;
  doc.setFillColor(...COLORS.primary);
  doc.rect(LAYOUT.marginX, barY, LAYOUT.width, 9, "F");

  const textY = barY + 6;
  doc.setFontSize(14);
  doc.setTextColor(255);
  doc.setFont(FONTS.main, FONTS.bold);
  doc.text(
    `Report Period: ${dateRange.from || "N/A"} to ${dateRange.to || "N/A"}`,
    centerX,
    textY,
    { align: "center" },
  );

  return barY + 15;
};


const drawSummary = (doc, startY, summary, pageWidth, pageHeight) => {
 
  if (startY > pageHeight - 50) {
    doc.addPage();
    startY = 50;
  }

  const boxWidth = 100;
  const boxHeight = 35;
  const boxX = pageWidth - LAYOUT.marginX - boxWidth; 

  doc.setFillColor(250, 250, 250);
  doc.rect(boxX, startY, boxWidth, boxHeight, "F");


  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.rect(boxX, startY, boxWidth, boxHeight);

 
  doc.setFontSize(13);
  doc.setFont(FONTS.main, FONTS.bold);
  doc.setTextColor(...COLORS.primary);
  doc.text("Summary", boxX + 5, startY + 8);


  doc.setDrawColor(...COLORS.textLight);
  doc.setLineWidth(0.3);
  doc.line(boxX + 5, startY + 10, boxX + boxWidth - 5, startY + 10);

  
  doc.setFontSize(10);
  doc.setFont(FONTS.main, FONTS.normal);
  doc.setTextColor(...COLORS.textMain);

  let detailY = startY + 18;
  const lineSpacing = 7;

  doc.text(`Total Policies: ${summary.totalPolicies || 0}`, boxX + 5, detailY);
  detailY += lineSpacing;

  doc.text(`Paid: ${summary.paidPoliciesCount || 0}`, boxX + 5, detailY);
  detailY += lineSpacing;

  doc.text(
    `Cancelled: ${summary.cancelledPoliciesCount || 0}`,
    boxX + 5,
    detailY,
  );
};
