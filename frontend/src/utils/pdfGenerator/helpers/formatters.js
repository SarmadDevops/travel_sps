import dayjs from "dayjs";

export const safeStr = (val, fallback = "—") => (val ? String(val) : fallback);
export const safeNum = (val) => Number(val) || 0;

export const formatDate = (date) => 
  dayjs(date).isValid() ? dayjs(date).format("MMM DD, YYYY") : "—";

export const checkPageBreak = (doc, currentY, pageHeight, addHeaderFn) => {
  if (currentY > pageHeight - 35) {
    doc.addPage();
    if (addHeaderFn) return addHeaderFn(doc);
    return 55; 
  }
  return currentY;
};