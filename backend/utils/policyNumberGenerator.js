const { UnderWritingPolicy } = require("../models");

const generatePolicyNumber = async () => {
  let policyNumber;
  let exists = true;

  while (exists) {
    // 🔢 Random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    policyNumber = `SPS-PK-${randomNumber}`;

    // 🔍 Check duplicate
    const check = await UnderWritingPolicy.findOne({
      where: { policyNumber }
    });

    exists = !!check;
  }

  return policyNumber;
};

module.exports = generatePolicyNumber;
