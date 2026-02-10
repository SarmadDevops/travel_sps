import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

import { getAllSchengenPackages } from "../api/schengenPackage";
import { getAllRestOfWorldPackages } from "../api/restOfWorld";
import { getAllStudentPackages } from "../api/studentPackage";
import { getAllWorldWidePackages } from "../api/worldWidePackages";

import spsLogo from "../assets/securpathsolution.png";

const SPS_COLORS = {
  primary: [0, 102, 153],
  primaryDark: [0, 80, 130],
  light: [230, 245, 255],
  gray: [100, 100, 100],
  lightGray: [240, 240, 240], 
  dark: [30, 30, 30],
  watermark: [150, 150, 150], 
};

const safeStr = (val, fallback = "") => String(val ?? fallback);
const safeNum = (val, fallback = 0) => Number(val) || fallback;

const PACKAGE_API_MAP = {
  schengen: { fn: getAllSchengenPackages, title: "Schengen Countries", currency: "$50,000", hasFamily: true },
  "rest-of-world": { fn: getAllRestOfWorldPackages, title: "Rest of World (Excl. USA, Canada, Australia)", currency: "$10,000", hasFamily: true },
  worldwide: { fn: getAllWorldWidePackages, title: "Worldwide", currency: "Various Limits", hasFamily: true },
  "student-plan": { fn: getAllStudentPackages, title: "Student Plan", currency: "Various Limits", hasFamily: false },
};

// --- HELPER: PAGE BREAK CHECKER ---
const checkPageBreak = (doc, y, pageHeight, policyNumber) => {
  if (y > pageHeight - 40) {
    doc.addPage();
    addHeader(doc, policyNumber);
    return 55; 
  }
  return y;
};

// --- HEADER ---
const addHeader = (doc, policyNumber = "SPSPK-7823148") => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const imgProps = doc.getImageProperties(spsLogo);
  const logoWidth = 30; 
  const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
  
  doc.addImage(spsLogo, "PNG", 15, 8, logoWidth, logoHeight);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SPS_COLORS.primary);
  doc.text("SecurPath Solution (SPS)", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SPS_COLORS.gray);
  doc.text("A Member Company of United International Group", pageWidth / 2, 24, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(dayjs().format("DD/MM/YYYY - hh:mm A"), 15, 6);

  doc.setFillColor(...SPS_COLORS.primary);
  doc.rect(15, 35, pageWidth - 30, 9, "F"); 

  doc.setFontSize(14);
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text("SPS TRAVEL & HEALTH GUARD", pageWidth / 2, 41, { align: "center" });

  doc.setFontSize(11);
  doc.text(policyNumber, pageWidth - 20, 41, { align: "right" });
};

// --- SECTION HEADER HELPER ---
const addSectionHeader = (doc, title, y, pageWidth) => {
  doc.setFillColor(...SPS_COLORS.lightGray);
  doc.rect(15, y, pageWidth - 30, 7, "F"); 
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(title, 17, y + 5);
  return y + 7; 
};

const numberToWords = (num) => {
  const n = safeNum(num);
  if (n === 0) return "Zero";
  const belowTwenty = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Million', 'Billion'];
  let word = '';
  let i = 0;
  let temp = n;
  while (temp > 0) {
    let chunk = temp % 1000;
    if (chunk) {
      let chunkWord = '';
      if (chunk >= 100) { chunkWord += belowTwenty[Math.floor(chunk / 100)] + ' Hundred '; chunk %= 100; }
      if (chunk >= 20) { chunkWord += tens[Math.floor(chunk / 10)] + ' '; chunk %= 10; }
      if (chunk > 0) { chunkWord += belowTwenty[chunk] + ' '; }
      word = chunkWord + thousands[i] + ' ' + word;
    }
    temp = Math.floor(temp / 1000);
    i++;
  }
  return word.trim();
};

const addWatermark = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const prevFontSize = doc.getFontSize();
  const prevTextColor = doc.getTextColor();
  const prevFont = doc.getFont();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(90); 
  doc.setTextColor(...SPS_COLORS.watermark);
  const gState = new doc.GState({ opacity: 0.15 }); 
  doc.setGState(gState);
  doc.text("SPS DRAFT", pageWidth / 2, pageHeight / 2, { angle: 45, align: "center", baseline: "middle" });
  doc.setGState(new doc.GState({ opacity: 1 }));

  doc.setFontSize(prevFontSize);
  doc.setTextColor(prevTextColor);
  doc.setFont(prevFont.fontName, prevFont.fontStyle);
};

const renderTable = (doc, startY, headers, body, hasFamily = true) => {
  autoTable(doc, {
    startY,
    theme: "grid",
    styles: { fontSize: 7.2, cellPadding: 2.5, overflow: "linebreak", halign: "center", valign: "middle", lineWidth: 0.1, lineColor: [0, 0, 0] },
    headStyles: { fillColor: SPS_COLORS.primary, textColor: 255, fontStyle: "bold", fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 32, halign: "left" }, 1: { cellWidth: 26 } },
    margin: { left: 15, right: 15 },
    head: headers,
    body,
    didParseCell: (data) => {
      if (data.cell.section === "head" && data.cell.text.length > 1) { data.cell.styles.cellPadding = 3; }
    },
  });
};

export const generatePolicyPDF = async ({ formValues, selectedPrice, policyNumber = "SPSPK-7823148" }) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- PAGE 1 ---
  addHeader(doc, policyNumber);
  
  let y = 55; 

  // --- 1. INSURED DETAILS (Updated Spacing) ---
  addSectionHeader(doc, "INSURED DETAILS", y, pageWidth);
  y += 10; 

  // Row 1 Header (Gray)
  doc.setFillColor(...SPS_COLORS.lightGray);
  doc.rect(15, y, pageWidth - 30, 6, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  
  // WIDER SPACING HERE
  doc.text("Name of Insured", 17, y + 4);
  doc.text("Age", 80, y + 4);       // Moved Right
  doc.text("Passport No.", 110, y + 4); // Moved Right
  doc.text("NIC #", 155, y + 4);      // Moved Right
  
  y += 6;
  
  // Row 1 Data
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  doc.text(safeStr(formValues.insuredName, "—").toUpperCase(), 17, y + 4);
  
  const ageVal = dayjs(formValues.dob).isValid() 
    ? dayjs().diff(dayjs(formValues.dob), 'year') + " Years" 
    : "—";
  doc.text(ageVal, 80, y + 4);
  
  doc.text(safeStr(formValues.passport, "—"), 110, y + 4);
  doc.text(safeStr(formValues.cnic, "—"), 155, y + 4);

  y += 10;

  // Row 2 Header (Gray)
  doc.setFillColor(...SPS_COLORS.lightGray);
  doc.rect(15, y, pageWidth - 30, 6, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  doc.text("Address", 17, y + 4);
  doc.text("Contact No.", 155, y + 4); 

  y += 6;
  
  // Row 2 Data
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const addressText = safeStr(formValues.address, "—");
  const splitAddress = doc.splitTextToSize(addressText, 130); 
  doc.text(splitAddress, 17, y + 4);
  
  doc.text(safeStr(formValues.contact, "—"), 155, y + 4);

  y += (splitAddress.length * 5) + 6; 

  // Row 3: Beneficiary Header (Gray)
  doc.setFillColor(...SPS_COLORS.lightGray);
  doc.rect(15, y, pageWidth - 30, 6, "F"); 
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  doc.text("Beneficiary Name", 17, y + 4);
  doc.text("Relationship", 155, y + 4); 

  y += 6;
  
  // Row 3 Data
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  doc.text(safeStr(formValues.beneficiary, "—"), 17, y + 4);
  doc.text(safeStr(formValues.beneficiaryRelationship, "—"), 155, y + 4);
  
  y += 12;

  // --- 2. FAMILY MEMBERS (Strictly Conditional) ---
  if (formValues.planType === 'family') {
    addSectionHeader(doc, "FAMILY MEMBERS", y, pageWidth);
    y += 10;

    // Header Bar
    doc.setFillColor(...SPS_COLORS.lightGray);
    doc.rect(15, y, pageWidth - 30, 6, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    
    doc.text("Name", 17, y + 4);
    doc.text("Relationship", 70, y + 4);
    doc.text("Passport / CNIC", 100, y + 4);
    doc.text("DOB / Age", 145, y + 4);
    
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (formValues.spouseName) {
        doc.text(safeStr(formValues.spouseName), 17, y + 4);
        doc.text("Spouse", 70, y + 4);
        doc.text(`${safeStr(formValues.spousePassport, "-")} / ${safeStr(formValues.spouseCnic, "-")}`, 100, y + 4);
        doc.text(dayjs(formValues.spouseDob).isValid() ? dayjs(formValues.spouseDob).format("DD/MM/YYYY") : "-", 145, y + 4);
        y += 6;
    }

    const children = [
        { n: formValues.child1Name, p: formValues.child1Passport, a: formValues.child1Age },
        { n: formValues.child2Name, p: formValues.child2Passport, a: formValues.child2Age },
        { n: formValues.child3Name, p: formValues.child3Passport, a: formValues.child3Age }
    ].filter(c => c.n);

    children.forEach(c => {
        doc.text(safeStr(c.n), 17, y + 4);
        doc.text("Child", 70, y + 4);
        doc.text(safeStr(c.p, "-"), 100, y + 4);
        doc.text(`${safeStr(c.a)} Years`, 145, y + 4);
        y += 6;
    });
    
    y += 4;
  }

  // --- 3. TRIP DETAIL ---
  addSectionHeader(doc, "TRIP DETAIL", y, pageWidth);
  y += 10;

  doc.setFont("helvetica", "normal");
  
  // Trip Columns
  const col1X = 17; const col1ValX = 55;
  const col2X = 110; const col2ValX = 145;
  
  doc.text("Country of Travel:", col1X, y);
  doc.text(safeStr(formValues.country, "—").toUpperCase(), col1ValX, y);

  doc.text("Producer's ID:", col2X, y);
  doc.text(safeStr(formValues.agentId, "Direct"), col2ValX, y);

  y += 6;
  doc.text("No of Days:", col1X, y);
  doc.text(`${safeStr(formValues.days, "—")} Days`, col1ValX, y);

  doc.text("Issued at:", col2X, y);
  doc.text("Head Office", col2ValX, y);

  y += 6;
  doc.text("Effective Date:", col1X, y);
  doc.text(dayjs(formValues.dateFrom).isValid() ? dayjs(formValues.dateFrom).format("MMM DD, YYYY") : "—", col1ValX, y);

  y += 6;
  doc.text("Expiry Date:", col1X, y);
  const daysNum = safeNum(formValues.days, 0);
  doc.text(
    dayjs(formValues.dateFrom).isValid()
      ? dayjs(formValues.dateFrom).add(daysNum, "day").format("MMM DD, YYYY")
      : "—",
    col1ValX,
    y
  );

  y += 12;

  // Plan Summary
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ZONE OF TRAVEL", 15, y);
  doc.text("CHOICE OF PLAN", 80, y);
  doc.text("CHOICE OF BENEFITS", 140, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("✓ " + safeStr(formValues.country, "—").toUpperCase(), 15, y);
  doc.text("✓ " + (formValues.planType === 'family' ? "Family" : "Single"), 80, y);
  doc.text("✓ " + safeStr(formValues.planRequired, "Standard").toUpperCase(), 140, y);

  y += 12;

  // --- PREMIUM SECTION ---
  const premiumY = y;
  doc.setFontSize(11);
  const price = safeNum(selectedPrice);
  doc.text(`Premium Amount : ${price.toLocaleString()}.00`, 15, y);
  y += 6;
  doc.text("Advance Tax (I.T.O) 2001 : 0.00", 15, y);
  y += 6;
  doc.text(`Total Premium Payable in Pak Rupees : ${price.toLocaleString()}.00`, 15, y);
  y += 6;
  doc.text(`( ${numberToWords(price)} Rupees Only )`, 15, y);

  const rightX = pageWidth - 15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Swan International Assistance (SIA)", rightX, premiumY, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text("International: +961 9 211 662", rightX, premiumY + 6, { align: "right" });
  doc.text("USA/ Canada: +1 514 448 4417", rightX, premiumY + 12, { align: "right" });
  doc.text("France/Europe: +33 9 75 18 52 99", rightX, premiumY + 18, { align: "right" });

  y = Math.max(y, premiumY + 30) + 10;

  // --- FIX: WORLDWIDE POLICY ---
  y = checkPageBreak(doc, y, pageHeight, policyNumber);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("WORLDWIDE POLICY", 15, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text("Medical Expenses & Hospitalization Abroad - $ 50,000", 15, y);

  y += 12;
  doc.text("Repatriation of Mortal Remains - Actual Expenses", 15, y);
  y += 6;
  doc.text("Equivalent / More Than € 43,000", 15, y);

  y += 12;

  // Footer Info (Page 1)
  doc.setFontSize(9);
  doc.text("Scan for Digital App", 15, y);
  y += 6;
  doc.text("If you seek more information, please contact us: 042 111 000 014", 15, y);

  doc.setDrawColor(...SPS_COLORS.primary);
  doc.line(15, pageHeight - 22, pageWidth - 15, pageHeight - 22);

  doc.setFontSize(8);
  doc.setTextColor(...SPS_COLORS.gray);
  doc.text("SPS House, 1st floor, 1-Upper Mall, Lahore - Pakistan", 15, pageHeight - 17);
  doc.text("UAN:(92 42) 111 000 014 Tel: (92 42) 35776475-83.", 15, pageHeight - 12);
  doc.text("http://www.securpathsolution.com", 15, pageHeight - 7);

  doc.text("V: 16.1.00", pageWidth - 15, pageHeight - 7, { align: "right" });

  doc.setTextColor(0);
  doc.text("*THIS IS A COMPUTER-GENERATED DOCUMENT AND IT DOES NOT REQUIRE A SIGNATURE OR STAMP.", pageWidth / 2, pageHeight - 27, { align: "center" });

  // --- PAGE 2: PREMIUM TABLES ---
  doc.addPage();
  addHeader(doc, policyNumber);
  
  y = 52;

  // **FIXED STUDENT PLAN DATA ACCESS**
  for (const [key, config] of Object.entries(PACKAGE_API_MAP)) {
    try {
      const res = await config.fn();
      const packages = res?.packages || res?.data || res || [];

      if (!packages.length) continue;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...SPS_COLORS.primary);
      doc.text(`${config.title} Premium (${config.currency})`, 15, y);

      y += 6;

      const headers = [
        [{ content: "Duration", rowSpan: 2, styles: { valign: "middle", halign: "center" } }],
        [{ content: "Max Stay", rowSpan: 2, styles: { valign: "middle", halign: "center" } }],
      ];

      // Student Plan Logic Fix
      if (key === "student-plan") {
          headers[0].push({ content: "Scholar", rowSpan: 2, styles: { valign: "middle", halign: "center" } });
          headers[0].push({ content: "Scholar Plus", rowSpan: 2, styles: { valign: "middle", halign: "center" } });
          headers[0].push({ content: "Scholar Pro", rowSpan: 2, styles: { valign: "middle", halign: "center" } });

          const body = packages.map(pkg => {
            return [
                safeStr(pkg.duration || "-"), 
                safeStr(pkg.maxStay || "-"),
                safeStr(pkg.scholar || pkg.Scholar || "-"), // Case insensitive fallback
                safeStr(pkg.scholarPlus || pkg.ScholarPlus || "-"),
                safeStr(pkg.scholarPro || pkg.ScholarPro || "-")
            ];
          });
          renderTable(doc, y, headers, body, false);
      } 
      // Existing Logic for other packages
      else {
          const firstPkg = packages[0];
          const planKeys = Object.keys(firstPkg).filter(k =>
            !["duration", "maxStay", "id", "_id", "createdAt", "updatedAt", "notes"].includes(k)
          );

          if (config.hasFamily) {
            const subHeader = [];
            const uniquePlans = [...new Set(planKeys.map(k => k.replace(/Single|Family$/, "")))];
            uniquePlans.forEach(plan => {
              headers[0].push({ content: plan.charAt(0).toUpperCase() + plan.slice(1), colSpan: 2, styles: { halign: "center" } });
              subHeader.push("Single (Rs.)", "Family (Rs.)");
            });
            headers.push(subHeader);

            const body = packages.map(pkg => {
              const row = [safeStr(pkg.duration || "-"), safeStr(pkg.maxStay || "-")];
              uniquePlans.forEach(plan => {
                row.push(safeStr(pkg[`${plan}Single`] || "-"), safeStr(pkg[`${plan}Family`] || "-"));
              });
              return row;
            });
            renderTable(doc, y, headers, body, true);
          } else {
            // General Fallback (if any non-student single package exists)
            planKeys.forEach(plan => {
              headers[0].push({ content: plan.charAt(0).toUpperCase() + plan.slice(1), rowSpan: 2, styles: { valign: "middle", halign: "center" } });
            });
            const body = packages.map(pkg => {
              const row = [safeStr(pkg.duration || "-"), safeStr(pkg.maxStay || "-")];
              planKeys.forEach(plan => { row.push(safeStr(pkg[plan] || "-")); });
              return row;
            });
            renderTable(doc, y, headers, body, false);
          }
      }

      y = doc.lastAutoTable.finalY + 14;
      y = checkPageBreak(doc, y, pageHeight, policyNumber);

    } catch (err) {
      console.warn(`Failed to load ${key} packages:`, err);
    }
  }

  // --- PAGE 3: COVERAGE & BENEFITS ---
  doc.addPage();
  addHeader(doc, policyNumber);
  
  y = 52;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SPS_COLORS.primary);
  doc.text("DECLARATION:", 15, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text("I am not traveling to receive medical treatment, diagnosis or consultation.", 15, y);

  y += 14;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SPS_COLORS.primary);
  doc.text("COVERAGE FOR TRAVEL GUARD", 15, y);

  y += 8;

  // --- FIXED: CENTRALIZED TABLE ---
  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 6.8, cellPadding: 2.2, overflow: "linebreak", halign: "center", valign: "middle", lineWidth: 0.1, lineColor: [0, 0, 0] },
    headStyles: { fillColor: SPS_COLORS.primary, textColor: 255, fontStyle: "bold", fontSize: 7.2 },
    columnStyles: { 0: { cellWidth: 55, halign: "left" }, 1: { cellWidth: 19 }, 2: { cellWidth: 19 }, 3: { cellWidth: 19 }, 4: { cellWidth: 19 }, 5: { cellWidth: 19 }, 6: { cellWidth: 19 }, 7: { cellWidth: 19 } },
    margin: { left: 10, right: 10 }, 
    head: [
      [
        { content: "Schedule of Benefits", rowSpan: 2, styles: { valign: "middle", halign: "left" } },
        { content: "Schengen Countries", colSpan: 2, styles: { halign: "center" } },
        { content: "Rest of World (Excl. USA, CANADA & AUSTRALIA)", colSpan: 2, styles: { halign: "center" } },
        { content: "Worldwide", colSpan: 3, styles: { halign: "center" } },
      ],
      ["Diamond", "Gold", "Silver", "Standard", "Titanium", "Platinum", "Gold Plus"],
    ],
    body: [
      ["Currency", "USD", "USD", "USD", "USD", "USD", "USD", "USD"],
      ["Medical Expenses, Hospitalization Abroad & COVID-19", "50,000", "50,000", "25,000", "10,000", "150,000", "100,000", "50,000"],
      ["Transport or Repatriation in case of illness or Accident", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Repatriation of Mortal Remains", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Dental Care", "600", "600", "600", "600", "600", "600", "600"],
      ["Repatriation of Family Member Travelling with Insured", "Actual Expenses", "Actual Expenses", "N/A", "N/A", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Travel of One Immediate Family Member", "100/Day-Max 1,000", "100/Day-Max 1,000", "N/A", "N/A", "100/Day-Max 1,000", "100/Day-Max 1,000", "100/Day-Max 1,000"],
      ["Delivery of Medicines", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Relay of Urgent Messages", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Long Distance Medical Information Service", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Medical Referral / Appointment of Local Medical Specialist", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Connections Services", "N/A", "N/A", "N/A", "N/A", "Unlimited", "Unlimited", "N/A"],
      ["Loss Of Credit Card", "500", "300", "200", "200", "2,000", "2,000", "300"],
      ["Delayed Departure", "500", "300", "200", "200", "1,000", "1,000", "300"],
      ["Compression for In-Flight Loss of Checked in Baggage", "500", "400", "400", "300", "1,000", "1,000", "400"],
      ["Accidental Death (During Travel using recognized means of Transport)", "15,000", "10,000", "8,000", "5,000", "25,000", "25,000", "10,000"],
    ],
  });

  y = doc.lastAutoTable.finalY + 14;
  y = checkPageBreak(doc, y, pageHeight, policyNumber);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SPS_COLORS.primary);
  doc.text("STUDENT PLAN BENEFITS", 15, y);

  y += 8;

  // Student Plan Table (Adjusted width)
  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 8.5, halign: "left", cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: SPS_COLORS.primary, textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
    margin: { left: 10, right: 10 },
    head: [
      [{ content: "Schedule of Benefits", rowSpan: 2, styles: { valign: "middle" } }, { content: "Plans (Limit in USD)", colSpan: 3, styles: { halign: "center" } }],
      ["Sapphire Elite (USD)", "Sapphire (USD)", "Sapphire Plus (USD)"],
    ],
    body: [
      ["Medical Expenses for Sickness & hospitalization Abroad", "150,000 (Excess $ 150)", "50,000 (Excess $ 150)", "100,000 (Excess $ 150)"],
      ["Emergency Dental Care", "1,000", "1,000", "1,000"],
      ["Travel of One Immediate Family Member", "5,000", "5,000", "5,000"],
      ["Repatriation of Mortal Remains", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Transport or Repatriation in case of Illness or Accident", "Actual Expenses", "Actual Expenses", "Actual Expenses"],
      ["Loss of Passport", "300", "300", "300"],
      ["Loss In-Flight Lost of Checked in Baggage", "500", "500", "500"],
      ["Accidental Death", "100% of Principal Sum Insured", "100% of Principal Sum Insured", "100% of Principal Sum Insured"],
      ["Permanent Total Disability", "100% of Principal Sum Insured", "100% of Principal Sum Insured", "100% of Principal Sum Insured"],
    ],
  });

  y = doc.lastAutoTable.finalY + 14;
  y = checkPageBreak(doc, y, pageHeight, policyNumber);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Note: Excess/deductible of each & every claim will be as follows:-", 15, y);

  y += 8;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, halign: "center", cellPadding: 3 },
    headStyles: { fillColor: SPS_COLORS.light, textColor: 0, fontStyle: "bold" },
    head: [["", "From 0 to 70 Years", "From 71 to 85 Years", "From 86 to 90 Years"]],
    body: [["USD", "100", "150", "300"]],
  });

  y = doc.lastAutoTable.finalY + 12;
  y = checkPageBreak(doc, y, pageHeight, policyNumber);

  doc.setFontSize(10);
  doc.text("* Pre-existing conditions are not covered.", 15, y);
  y += 6;
  doc.text("Excluding Countries: Afghanistan, Cuba, Israel, Pakistan", 15, y);
  y += 10;
  doc.text("This Policy shall be deemed to be issued as an electronic document. Any print out of the same is for the purpose of record and reference only.", 15, y, { maxWidth: 180 });

  // Final watermark safety - ADDED AT THE END FOR ALL PAGES
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addWatermark(doc);
  }

  doc.save(`SPS_Policy_${safeStr(formValues.insuredName, "Travel")}.pdf`);
};