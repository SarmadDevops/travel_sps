import dayjs from "dayjs";
import { COLORS, LAYOUT, FONTS } from "../config";
import spsLogo from "../../../assets/splogo.png"; 

export const drawHeader = (doc, policyNumber = "DRAFT") => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;


  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(dayjs().format("DD/MM/YYYY - hh:mm A"), LAYOUT.marginX, 6);


  const imgProps = doc.getImageProperties(spsLogo);
  const logoWidth = 25; // Slightly larger for better visibility
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
  doc.text("A Member Company of United International Group", centerX, 24, { align: "center" });


  const barY = 35;
  doc.setFillColor(...COLORS.primary);
  doc.rect(LAYOUT.marginX, barY, LAYOUT.width, 9, "F"); 

  const textY = barY + 6;
  doc.setFontSize(14);
  doc.setTextColor(255);
  doc.setFont(FONTS.main, FONTS.bold);
  doc.text("SPS TRAVEL & HEALTH GUARD", centerX, textY, { align: "center" });

  doc.setFontSize(11);
  doc.text(String(policyNumber), 193, textY, { align: "right" });

  return barY + 15;
};