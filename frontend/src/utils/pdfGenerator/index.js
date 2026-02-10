import jsPDF from "jspdf";
import { drawHeader } from "./core-components/Header";
import { drawPageOneContent } from "./core-components/InsuredDetails"; 
import { fetchAndDrawPlanTables } from "./core-components/PlanTables";
import { drawFooter } from "./core-components/Footer";
import { addWatermark } from "./core-components/Watermark"; 
import { checkPageBreak } from "./helpers/formatters";
import { drawTravelGuardTable } from "./core-components/TravelGuardTable";
import { drawStudentPlanTable } from "./core-components/StudentPlanTable";
import { drawDisclaimers } from "./core-components/Disclaimers";

export const generatePolicyPDF = async ({ 
  formValues, 
  selectedPrice, 
  policyNumber, 
  packagesData,
  policyStatus = "PENDING", 
  paymentStatus = "UNPAID", 
  isPrintAction = false 
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageHeight = doc.internal.pageSize.getHeight();

  const handlePageBreak = (d, y) => checkPageBreak(d, y, pageHeight, (newDoc) => drawHeader(newDoc, policyNumber));


  let currentY = drawHeader(doc, policyNumber);
  
 
  currentY = drawPageOneContent(doc, currentY, formValues, selectedPrice, paymentStatus, policyStatus);
  
  drawFooter(doc);

  
  doc.addPage();
  currentY = drawHeader(doc, policyNumber);
  await fetchAndDrawPlanTables(doc, currentY, handlePageBreak);
  drawFooter(doc);

  
  doc.addPage(); 
  currentY = drawHeader(doc, policyNumber);
  
 
  drawTravelGuardTable(doc, currentY);
  
  drawFooter(doc);

  
  doc.addPage();
  currentY = drawHeader(doc, policyNumber);
  
 
  currentY = drawStudentPlanTable(doc, currentY);
  

  drawDisclaimers(doc, currentY);

  drawFooter(doc);

  
  
  addWatermark(doc, isPrintAction, policyStatus, paymentStatus);

  doc.save(`SPS_Policy_${formValues.insuredName || "Draft"}.pdf`);
};