import { COLORS, LAYOUT, FONTS } from "../config";

export const drawFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    let y = height - 22;

    doc.setDrawColor(...COLORS.primary);
    doc.line(LAYOUT.marginX, y, width - LAYOUT.marginX, y);
    y += 5;

    doc.setFontSize(8);
    doc.setFont(FONTS.main, "normal");
    doc.setTextColor(...COLORS.textLight);
    
    doc.text("SPS House, 1st floor, 1-Upper Mall, Lahore - Pakistan", LAYOUT.marginX, y);
    doc.text("UAN: (92 42) 111 000 014", LAYOUT.marginX, y + 4);
    
    doc.text("V: 16.1.00", width - LAYOUT.marginX, y + 8, { align: "right" });
    
    doc.setTextColor(0);
    doc.setFontSize(7);
    doc.text("*COMPUTER-GENERATED DOCUMENT - NO SIGNATURE REQUIRED", width / 2, height - 5, { align: "center" });
  }
};