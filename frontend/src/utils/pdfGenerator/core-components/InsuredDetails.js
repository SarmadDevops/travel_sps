import dayjs from "dayjs";
import { COLORS, LAYOUT, FONTS } from "../config";
import { safeStr, formatDate, safeNum } from "../helpers/formatters";
import { numberToWords } from "../helpers/textUtils";


const drawSectionBar = (doc, y, title, statusText = null, statusColor = [0,0,0]) => {
  doc.setFillColor(...COLORS.secondaryBg);
  doc.rect(LAYOUT.marginX, y, LAYOUT.width, 7, "F");
  doc.setFont(FONTS.main, FONTS.bold);
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(title, LAYOUT.marginX + 2, y + 5);
  if (statusText) {
    doc.setTextColor(...statusColor);
    doc.setFont(FONTS.main, "bold"); 
    doc.setFontSize(9);
    doc.text(statusText, LAYOUT.marginX + LAYOUT.width - 1, y + 5, { align: "right" });
  }
  
  return y + 14; 
};
const drawRow = (doc, y, label1, val1, label2, val2) => {
  doc.setFont(FONTS.main, FONTS.bold);
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(label1, 17, y);
  if(label2) doc.text(label2, 110, y);

  doc.setFont(FONTS.main, FONTS.normal);
  doc.text(safeStr(val1).toUpperCase(), 55, y);
  if(val2) doc.text(safeStr(val2).toUpperCase(), 145, y);
  return y + 6;
};
export const drawPageOneContent = (doc, startY, form, price, paymentStatus = "UNPAID", policyStatus = "PENDING") => {
  let y = startY;
  let statusText = "";
  let statusColor = [0, 0, 0];
  if (policyStatus === "CANCELLED") {
    statusText = "POLICY CANCELLED";
    statusColor = [220, 50, 50];
  } else {
    const postStr = policyStatus === "POSTED" ? "POSTED" : "UNPOSTED";
    statusText = postStr; 
    if (policyStatus !== "POSTED") {
       statusColor = [200, 50, 50]; 
    } else {
       statusColor = [0, 150, 100]; 
    }
  }

  
  y = drawSectionBar(doc, y, "INSURED DETAILS", statusText, statusColor);
  
  const ageVal = dayjs(form.dob).isValid() ? dayjs().diff(dayjs(form.dob), 'year') + " Years" : "—";

  y = drawRow(doc, y, "Name of Insured:", form.insuredName, "Passport No:", form.passport);
  y = drawRow(doc, y, "Age:", ageVal, "CNIC #:", form.cnic);

 
  
  const addressStr = safeStr(form.address).toUpperCase();
  const addressLines = doc.splitTextToSize(addressStr, 50); 

  doc.setFont(FONTS.main, FONTS.bold);
  doc.text("Address:", 17, y);
  doc.text("Contact No:", 110, y);

  doc.setFont(FONTS.main, FONTS.normal);
  doc.text(addressLines, 55, y);
  doc.text(safeStr(form.contact).toUpperCase(), 145, y);

  const lineHeight = 4; 
  const rowHeight = Math.max(addressLines.length * lineHeight + 2, 6);
  
  y += rowHeight; 


  y = drawRow(doc, y, "Beneficiary:", form.beneficiary, "Relationship:", form.beneficiaryRelationship);
  
  y += 5; 


  if (form.planType === 'family') {
    y = drawSectionBar(doc, y, "FAMILY MEMBERS");
    
    doc.setFont(FONTS.main, FONTS.bold);
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Name", 17, y);
    doc.text("Relation", 70, y);
    doc.text("Passport / CNIC", 100, y);
    doc.text("DOB", 150, y);
    y += 6;

    doc.setFont(FONTS.main, FONTS.normal);
    
    if (form.spouseName) {
        doc.text(safeStr(form.spouseName), 17, y);
        doc.text("Spouse", 70, y);
        doc.text(`${safeStr(form.spousePassport)} / ${safeStr(form.spouseCnic)}`, 100, y);
        doc.text(formatDate(form.spouseDob), 150, y);
        y += 5;
    }
    
    [1, 2, 3].forEach(i => {
        if(form[`child${i}Name`]) {
            doc.text(safeStr(form[`child${i}Name`]), 17, y);
            doc.text("Child", 70, y);
            doc.text(safeStr(form[`child${i}Passport`]), 100, y);
            doc.text(`${safeStr(form[`child${i}Age`])} Years`, 150, y);
            y += 5;
        }
    });
    y += 5;
  }

  y = drawSectionBar(doc, y, "TRIP DETAILS");
  y = drawRow(doc, y, "Country:", form.country, "Producer ID:", form.agentId || "Direct");
  y = drawRow(doc, y, "No of Days:", `${form.days} Days`, "Issued At:", "Head Office");
  
  const expiry = dayjs(form.dateFrom).add(safeNum(form.days), "day");
  y = drawRow(doc, y, "Effective Date:", formatDate(form.dateFrom), "Expiry Date:", formatDate(expiry));
  
  y += 4;
  doc.setFont(FONTS.main, FONTS.bold);
  doc.text("ZONE: " + safeStr(form.country).toUpperCase(), 17, y);
  doc.text("PLAN: " + (form.planType === 'family' ? "Family" : "Single"), 80, y);
  doc.text("BENEFIT: " + safeStr(form.planRequired).toUpperCase(), 140, y);
  y += 12;


  const premiumY = y;
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Premium Amount: ${safeNum(price).toLocaleString()}.00`, 15, y);
  y += 5;
  doc.text("Advance Tax (I.T.O) 2001: 0.00", 15, y);
  y += 5;
  doc.setFont(FONTS.main, FONTS.bold);
  doc.text(`Total Payable (PKR): ${safeNum(price).toLocaleString()}.00`, 15, y);
  y += 5;
  doc.setFont(FONTS.main, FONTS.normal);
  doc.text(`( ${numberToWords(price)} Rupees Only )`, 15, y);

  let contactY = premiumY;
  const rightX = 195;
  doc.setFont(FONTS.main, FONTS.bold);
  doc.text("Swan International Assistance (SIA)", rightX, contactY, { align: "right" });
  contactY += 5;
  doc.setFont(FONTS.main, FONTS.normal);
  doc.text("International: +961 9 211 662", rightX, contactY, { align: "right" });
  contactY += 5;
  doc.text("USA/Canada: +1 514 448 4417", rightX, contactY, { align: "right" });
  contactY += 5;
  doc.text("France/Europe: +33 9 75 18 52 99", rightX, contactY, { align: "right" });

  y = Math.max(y, contactY) + 12;


  doc.setFont(FONTS.main, FONTS.bold);
  doc.text("WORLDWIDE POLICY", 15, y);
  y += 6;
  doc.setFont(FONTS.main, FONTS.normal);
  doc.text("Medical Expenses & Hospitalization Abroad - $ 50,000", 15, y);
  y += 6;
  doc.text("Repatriation of Mortal Remains - Actual Expenses", 15, y);
  y += 6;
  doc.text("Equivalent / More Than € 43,000", 15, y);
  y += 10;

  doc.setFontSize(9);
  doc.text("Scan for Digital App", 15, y);
  y += 5;
  doc.text("If you seek more information, please contact us: 042 111 000 014", 15, y);

  return y;
};