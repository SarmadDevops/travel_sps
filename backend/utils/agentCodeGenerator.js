const { Agent } = require("../models");

const generateAgentCode = async (transaction) => {
  const lastAgent = await Agent.findOne({
    order: [["createdAt", "DESC"]],
    attributes: ["agentCode"],
    transaction
  });

  let nextCode = 1472; //  starting number

  if (lastAgent?.agentCode) {
    nextCode = parseInt(lastAgent.agentCode, 10) + 1;
  }

  return String(nextCode);
};

module.exports = { generateAgentCode };
