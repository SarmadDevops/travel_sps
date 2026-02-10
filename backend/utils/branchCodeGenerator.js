const { Branch } = require("../models");

const generateBranchCode = async (transaction) => {
  const lastBranch = await Branch.findOne({
    order: [["createdAt", "DESC"]],
    attributes: ["branchCode"],
    transaction
  });

  let nextCode = 512;

  if (lastBranch?.branchCode) {
    nextCode = parseInt(lastBranch.branchCode, 10) + 1;
  }

  return String(nextCode);
};

module.exports = { generateBranchCode };
