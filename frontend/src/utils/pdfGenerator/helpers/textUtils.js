import { safeNum } from "./formatters";

export const numberToWords = (num) => {
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