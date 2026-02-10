import { COLORS } from "../config";

export const addWatermark = (doc, isPrintAction, policyStatus, paymentStatus) => {
  const pageCount = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();


  let text = "SPS DRAFT";
  let color = COLORS.watermark || [150, 150, 150]; 
  let opacity = 0.1;


  
 
  if (policyStatus === "CANCELLED") {
    text = "CANCELLED";
    color = [200, 50, 50];
    opacity = 0.15;
  }

  else if (policyStatus === "POSTED") {
    return; 
  }
 
  else {
    text = "SPS DRAFT";
    color = [100, 100, 100]; 
    opacity = 0.20; 
  }


  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.saveGraphicsState();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(50); 
    doc.setTextColor(...color);

    const gState = new doc.GState({ opacity: opacity }); 
    doc.setGState(gState);

    
    for (let x = 0; x < width; x += width / 2) {
      for (let y = 0; y < height; y += height / 4) {
        
        doc.text(text, x + 70, y + 50, { 
          angle: 35, 
          align: "center", 
          baseline: "middle" 
        });

      }
    }
    
    doc.restoreGraphicsState();
  }
};