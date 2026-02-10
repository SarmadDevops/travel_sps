const { UnderWritingPolicy, Branch,User, Agent,sequelize } = require("../models");
const { Op } = require("sequelize");
const generatePolicyNumber = require("../utils/policyNumberGenerator");

// exports.createPolicy = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const admin = req.user;

//     if (!admin || admin.role !== "ADMIN") {
//       return res.status(403).json({ message: "Only ADMIN can create policy" });
//     }

//     const branch = await Branch.findByPk(admin.branchId, { transaction });

//     if (!branch || branch.remainingBalance < req.body.policyAmount) {
//       return res.status(400).json({ message: "Insufficient branch balance" });
//     }

//     const policy = await UnderWritingPolicy.create(
//       {
//         ...req.body,
//         branchId: admin.branchId,
//         adminId: admin.id
//       },
//       { transaction }
//     );

//     // ✅ CORRECT UPDATE
//     await branch.update(
//       {
//         remainingBalance: branch.remainingBalance - req.body.policyAmount,
//         issuedPolicyAmount: branch.issuedPolicyAmount + req.body.policyAmount
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(201).json({
//       message: "Policy created successfully",
//       policy
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error("CREATE POLICY ERROR 👉", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createPolicy = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const admin = req.user;

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can create policy" });
    }

    const branch = await Branch.findByPk(admin.branchId, { transaction });

    if (!branch || branch.remainingBalance < req.body.policyAmount) {
      return res.status(400).json({ message: "Insufficient branch balance" });
    }

    const policyNumber = await generatePolicyNumber(); //  UTILS

    const policy = await UnderWritingPolicy.create(
      {
        ...req.body,
        policyNumber,
        branchId: admin.branchId,
        adminId: admin.id
      },
      { transaction }
    );

    await branch.update(
      {
        remainingBalance: branch.remainingBalance - req.body.policyAmount,
        issuedPolicyAmount: branch.issuedPolicyAmount + req.body.policyAmount
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Policy created successfully",
      policy
    });

  } catch (error) {
    await transaction.rollback();
    console.error("CREATE POLICY ERROR ", error);
    res.status(500).json({ error: error.message });
  }
};

// READ POLICIES
// Admin → their branch only
exports.getBranchPolicies = async (req, res) => {
  try {
  
    const policies = await UnderWritingPolicy.findAll({
      where: { branchId: req.user.branchId },
      include: [
        { model: Branch, attributes: ["name"] },

        // ADMIN 
        { model: User, attributes: ["name", "email"] },

        // AGENT  (Agent model)
        { model: Agent, attributes: ["agentName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ policies });
  } catch (error) {
    console.error("GET BRANCH POLICIES ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyBusiness = async (req, res) => {
  try {
    const branchId = req.user.branchId;

    const data = await UnderWritingPolicy.findAll({
      attributes: [
        [
          sequelize.fn("MONTH", sequelize.col("createdAt")),
          "month"
        ],
        [
          sequelize.fn("SUM", sequelize.col("policyAmount")),
          "totalBusiness"
        ]
      ],
      where: {
        branchId,
        postStatus: "POSTED",        //  only confirmed business
        paymentStatus: "PAID"        // (optional but recommended)
      },
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "ASC"]],
      raw: true
    });

    const monthsMap = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const formatted = data.map(item => ({
      month: monthsMap[item.month - 1],
      amount: Number(item.totalBusiness)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("MONTHLY BUSINESS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch monthly business" });
  }
};

// READ POLICIES (Agent or Admin)
exports.getPolicies = async (req, res) => {
  try {
    const user = req.user; // From auth middleware

    let policies;

    if (user.role === "ADMIN") {
      // Admin → fetch policies for their branch
      policies = await UnderWritingPolicy.findAll({
        where: { branchId: user.branchId },
        include: [
          { model: Branch, attributes: ["name"] },
          { model: User, attributes: ["name", "email"] }, // Admin who created
          { model: Agent, attributes: ["agentName", "email"] }, // Agent info
        ],
        order: [["createdAt", "DESC"]],
      });
    } else if (user.role === "AGENT") {
      // Agent → fetch only their own policies
      if (!user.agentId) {
        return res.status(400).json({ message: "Agent ID missing in token" });
      }

      policies = await UnderWritingPolicy.findAll({
        where: { agentId: user.agentId },
        include: [
          { model: Branch, attributes: ["name"] },
          { model: User, attributes: ["name", "email"] }, // Admin who created
          { model: Agent, attributes: ["agentName", "email"] }, // Agent info
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ policies });
  } catch (error) {
    console.error("GET POLICIES ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};
// get agent policy analytics
// exports.getAgentPolicyAnalytics = async (req, res) => {
//   try {
//     const user = req.user;

//     if (user.role !== "AGENT") {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     if (!user.agentId) {
//       return res.status(400).json({ message: "Agent ID missing in token" });
//     }

//     const agentId = user.agentId;

//     const totalPolicies = await UnderWritingPolicy.count({
//       where: { agentId },
//     });

//     const paidPolicies = await UnderWritingPolicy.count({
//       where: { agentId, paymentStatus: "PAID" },
//     });

//     const unpaidPolicies = await UnderWritingPolicy.count({
//       where: { agentId, paymentStatus: "UNPAID" },
//     });

//     const postedPolicies = await UnderWritingPolicy.count({
//       where: { agentId, postStatus: "POSTED" },
//     });

//     const unpostedPolicies = await UnderWritingPolicy.count({
//       where: { agentId, postStatus: "UNPOSTED" },
//     });

//     // ✅ ONLY PAID AMOUNT
//     const totalPaidAmount = await UnderWritingPolicy.sum("policyAmount", {
//       where: {
//         agentId,
//         paymentStatus: "PAID",
//       },
//     });

//     res.json({
//       totalPolicies,
//       paidPolicies,
//       unpaidPolicies,
//       postedPolicies,
//       unpostedPolicies,
//       totalPaidAmount: totalPaidAmount || 0,
//     });
//   } catch (error) {
//     console.error("AGENT POLICY ANALYTICS ERROR 👉", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getAgentPolicyAnalytics = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "AGENT") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!user.agentId) {
      return res.status(400).json({ message: "Agent ID missing in token" });
    }

    const agentId = user.agentId;

    //  Exclude CANCELLED policies everywhere
    const baseWhere = {
      agentId,
      postStatus: { [Op.ne]: "CANCELLED" },
    };

    const totalPolicies = await UnderWritingPolicy.count({
      where: baseWhere,
    });

    const paidPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, paymentStatus: "PAID" },
    });

    const unpaidPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, paymentStatus: "UNPAID" },
    });

    const postedPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, postStatus: "POSTED" },
    });

    const unpostedPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, postStatus: "UNPOSTED" },
    });

    //  Revenue = ONLY PAID & NOT CANCELLED
    const totalPaidAmount = await UnderWritingPolicy.sum("policyAmount", {
      where: { ...baseWhere, paymentStatus: "PAID" },
    });

    //  Cancelled policies count (for dashboard card if needed)
    const cancelledPolicies = await UnderWritingPolicy.count({
      where: { agentId, postStatus: "CANCELLED" },
    });

    res.json({
      totalPolicies,
      paidPolicies,
      unpaidPolicies,
      postedPolicies,
      unpostedPolicies,
      cancelledPolicies, // added
      totalPaidAmount: totalPaidAmount || 0,
    });
  } catch (error) {
    console.error("AGENT POLICY ANALYTICS ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};

// Super Admin → all policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await UnderWritingPolicy.findAll({
      include: [
        { model: Branch, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] },
        { model: Agent, attributes: ["agentName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ policies });
  } catch (error) {
    console.error("GET ALL POLICIES ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};
// all policies analytics
exports.getAllPoliciesAnalytics = async (req, res) => {
  try {
    // Base condition: exclude cancelled policies
    const baseWhere = {
      postStatus: { [Op.ne]: "CANCELLED" },
    };

    const totalPolicies = await UnderWritingPolicy.count({ where: baseWhere });

    const paidPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, paymentStatus: "PAID" },
    });

    const unpaidPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, paymentStatus: "UNPAID" },
    });

    const postedPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, postStatus: "POSTED" },
    });

    const unpostedPolicies = await UnderWritingPolicy.count({
      where: { ...baseWhere, postStatus: "UNPOSTED" },
    });

    //  ONLY PAID & NON-CANCELLED AMOUNT
    const totalPaidAmount = await UnderWritingPolicy.sum("policyAmount", {
      where: { ...baseWhere, paymentStatus: "PAID" },
    });

    //  Count of cancelled policies separately
    const cancelledPolicies = await UnderWritingPolicy.count({
      where: { postStatus: "CANCELLED" },
    });

    res.json({
      totalPolicies,
      paidPolicies,
      unpaidPolicies,
      postedPolicies,
      unpostedPolicies,
      cancelledPolicies, // added
      totalPaidAmount: totalPaidAmount || 0,
    });
  } catch (error) {
    console.error("ALL POLICIES ANALYTICS ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getAllMonthlyBusiness = async (req, res) => {
  try {
    // optional: role check
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await UnderWritingPolicy.findAll({
      attributes: [
        [
          sequelize.fn("MONTH", sequelize.col("createdAt")),
          "month"
        ],
        [
          sequelize.fn("SUM", sequelize.col("policyAmount")),
          "totalBusiness"
        ]
      ],
      where: {
        postStatus: "POSTED",
        paymentStatus: "PAID"
      },
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "ASC"]],
      raw: true
    });

    const monthsMap = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const formatted = data.map(item => ({
      month: monthsMap[item.month - 1],
      amount: Number(item.totalBusiness)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("SUPER ADMIN MONTHLY BUSINESS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch monthly business" });
  }
};
// get branch count analytics 
// exports.getBranchPolicyAnalytics = async (req, res) => {
//   try {
//     const branchId = req.user.branchId;

//     const totalPolicies = await UnderWritingPolicy.count({
//       where: { branchId },
//     });

//     const paidPolicies = await UnderWritingPolicy.count({
//       where: { branchId, paymentStatus: "PAID" },
//     });

//     const unpaidPolicies = await UnderWritingPolicy.count({
//       where: { branchId, paymentStatus: "UNPAID" },
//     });

//     const postedPolicies = await UnderWritingPolicy.count({
//       where: { branchId, postStatus: "POSTED" },
//     });

//     const unpostedPolicies = await UnderWritingPolicy.count({
//       where: { branchId, postStatus: "UNPOSTED" },
//     });

//     // ✅ ONLY PAID AMOUNT (Revenue)
//     const totalPaidAmount = await UnderWritingPolicy.sum("policyAmount", {
//       where: {
//         branchId,
//         paymentStatus: "PAID",
//       },
//     });

//     res.json({
//       totalPolicies,
//       paidPolicies,
//       unpaidPolicies,
//       postedPolicies,
//       unpostedPolicies,
//       totalPaidAmount: totalPaidAmount || 0,
//     });
//   } catch (error) {
//     console.error("POLICY ANALYTICS ERROR 👉", error);
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getBranchPolicyAnalytics = async (req, res) => {
  try {
    const branchId = req.user.branchId;

    //  Exclude CANCELLED everywhere
    const baseWhere = {
      branchId,
      postStatus: { [Op.ne]: "CANCELLED" },
    };

    const totalPolicies = await UnderWritingPolicy.count({
      where: baseWhere,
    });

    const paidPolicies = await UnderWritingPolicy.count({
      where: {
        ...baseWhere,
        paymentStatus: "PAID",
      },
    });

    const unpaidPolicies = await UnderWritingPolicy.count({
      where: {
        ...baseWhere,
        paymentStatus: "UNPAID",
      },
    });

    const postedPolicies = await UnderWritingPolicy.count({
      where: {
        ...baseWhere,
        postStatus: "POSTED",
      },
    });

    const unpostedPolicies = await UnderWritingPolicy.count({
      where: {
        ...baseWhere,
        postStatus: "UNPOSTED",
      },
    });

    //  Revenue = ONLY PAID & NOT CANCELLED
    const totalPaidAmount = await UnderWritingPolicy.sum("policyAmount", {
      where: {
        ...baseWhere,
        paymentStatus: "PAID",
      },
    });

    //  Cancelled count (separate, for dashboard card if needed)
    const cancelledPolicies = await UnderWritingPolicy.count({
      where: {
        branchId,
        postStatus: "CANCELLED",
      },
    });

    res.json({
      totalPolicies,
      paidPolicies,
      unpaidPolicies,
      postedPolicies,
      unpostedPolicies,
      cancelledPolicies, //  added
      totalPaidAmount: totalPaidAmount || 0,
    });
  } catch (error) {
    console.error("POLICY ANALYTICS ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};

// GET POLICIES BY AGENT
exports.getPoliciesByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    const policies = await UnderWritingPolicy.findAll({
      where: { agentId },
      include: [
        { model: Branch, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] },
        { model: Agent, attributes: ["agentName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ policies });
  } catch (error) {
    console.error("GET POLICIES BY AGENT ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};


//  GET BRANCH UNPAID POLICIES
exports.getBranchUnpaidPolicies = async (req, res) => {
  try {
   

    const policies = await UnderWritingPolicy.findAll({
      where: { 
        branchId: req.user.branchId,
        paymentStatus: "UNPAID", // Only unpaid
      },
      include: [
        { model: Branch, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] },
        { model: Agent, attributes: ["agentName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ policies });
  } catch (error) {
    console.error("GET BRANCH UNPAID POLICIES ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL UNPAID POLICIES (SUPER ADMIN)
exports.getAllUnpaidPolicies = async (req, res) => {
  try {
    const policies = await UnderWritingPolicy.findAll({
      where: { paymentStatus: "UNPAID" }, // Only unpaid
      include: [
        { model: Branch, attributes: ["name"] },
        { model: User, attributes: ["name", "email"] },
        { model: Agent, attributes: ["agentName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ policies });
  } catch (error) {
    console.error("GET ALL UNPAID POLICIES ERROR ", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPolicyByPassportAndPolicyNumber = async (req, res) => {
  try {
    const { passportNo, policyNumber } = req.query;

    if (!passportNo || !policyNumber) {
      return res.status(400).json({
        message: "passportNo and policyNumber are required",
      });
    }

    const policy = await UnderWritingPolicy.findOne({
      where: {
        passportNo,
        policyNumber,
        
      },
      include: [
        {
          model: Branch,
          attributes: ["id", "name"],
        },

        // ADMIN / USER
        {
          model: User,
          attributes: ["id", "name", "email"],
        },

        // AGENT
        {
          model: Agent,
          attributes: ["id", "agentName", "email"],
        },
      ],
    });

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    res.status(200).json({
      message: "Policy fetched successfully",
      policy,
    });
  } catch (error) {
    console.error("GET POLICY ERROR ", error);
    res.status(500).json({ error: error.message });
  }
};

// controllers/underWritingController.js

// exports.getPolicyById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const policy = await UnderWritingPolicy.findByPk(id);

//     if (!policy) {
//       return res.status(404).json({
//         message: "Policy not found"
//       });
//     }

//     res.status(200).json({
//       message: "Policy fetched successfully",
//       policy
//     });

//   } catch (error) {
//     console.error("GET POLICY BY ID ERROR", error);
//     res.status(500).json({ error: error.message });
//   }
// };
exports.getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await UnderWritingPolicy.findByPk(id, {
      include: [
        {
          model: Branch,
          attributes: ["name"]   // branch ka data
        },
        {
          model: User,           // admin user
          attributes: ["name", "email"]
        },
        {
          model: Agent,
          attributes: ["agentName", "email"]
        }
      ]
    });

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found"
      });
    }

    res.status(200).json({
      message: "Policy fetched successfully",
      policy
    });

  } catch (error) {
    console.error("GET POLICY BY ID ERROR", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const admin = req.user;
    const { policyId } = req.params;
    const { postStatus, paymentStatus, underWriterNotes, superAdminNotes } =
      req.body;


    // 📄 Find policy
    const policy = await UnderWritingPolicy.findByPk(policyId, { transaction });

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found"
      });
    }

    // 🔄 Update fields
    await policy.update(
      {
        superAdminNotes: superAdminNotes ?? policy.superAdminNotes
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      message: "Policy updated successfully",
      data: policy
    });

  } catch (error) {
    await transaction.rollback();
    console.error("UPDATE POLICY ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

exports.updatePolicyStatusAndPayment = async (req, res) => {


  const { postStatus } = req.body; // Only need postStatus from client

  const transaction = await sequelize.transaction();

  try {
    const policy = await UnderWritingPolicy.findByPk(req.params.id, { transaction });
    if (!policy) {
      await transaction.rollback();
      return res.status(404).json({ message: "Policy not found" });
    }

    const branch = await Branch.findByPk(policy.branchId, { transaction });
    if (!branch) {
      await transaction.rollback();
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update post status
    await policy.update({ postStatus }, { transaction });

    // If policy not already paid, mark it as PAID and adjust branch balance
    if (policy.paymentStatus !== "PAID") {
      await policy.update({ paymentStatus: "PAID" }, { transaction });

      await branch.update(
        {
          remainingBalance: branch.remainingBalance + policy.policyAmount,
          issuedPolicyAmount: branch.issuedPolicyAmount - policy.policyAmount
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.json({ message: "Policy status updated and payment processed successfully" });
    
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAgentMonthlyBusiness = async (req, res) => {
  try {
    const user = req.user;

    //  Only AGENT allowed
    if (user.role !== "AGENT") {
      return res.status(403).json({ message: "Only agent allowed" });
    }

    if (!user.agentId) {
      return res.status(400).json({ message: "Agent ID missing in token" });
    }

    const data = await UnderWritingPolicy.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("SUM", sequelize.col("policyAmount")), "totalBusiness"]
      ],
      where: {
        agentId: user.agentId,
        postStatus: "POSTED",
        paymentStatus: "PAID"
      },
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "ASC"]],
      raw: true
    });

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const formatted = data.map(item => ({
      month: months[item.month - 1],
      amount: Number(item.totalBusiness)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("AGENT MONTHLY BUSINESS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch agent monthly business" });
  }
};


// exports.updatePolicyStatus = async (req, res) => {
//   if (req.user.role !== "SUPER_ADMIN") {
//     return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
//   }

//   const { postStatus, paymentStatus } = req.body;

//   const policy = await UnderWritingPolicy.findByPk(req.params.id);
//   if (!policy) return res.status(404).json({ message: "Policy not found" });

//   await policy.update({ postStatus, paymentStatus });

//   res.json({ message: "Policy updated successfully" });
// };

// exports.markPolicyPaid = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const policy = await UnderWritingPolicy.findByPk(req.params.id, { transaction });
//     const branch = await Branch.findByPk(policy.branchId, { transaction });

//     if (policy.paymentStatus === "PAID") {
//       return res.status(400).json({ message: "Already paid" });
//     }

//     await policy.update(
//       { paymentStatus: "PAID" },
//       { transaction }
//     );

//     await branch.update(
//       {
//         remainingBalance: branch.remainingBalance + policy.policyAmount,
//         issuedPolicyAmount: branch.issuedPolicyAmount - policy.policyAmount
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.json({ message: "Payment completed and balance adjusted" });

//   } catch (error) {
//     await transaction.rollback();
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// DELETE POLICY (SUPER_ADMIN)
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await UnderWritingPolicy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });

    await policy.destroy();
    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    console.error("DELETE POLICY ERROR ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/policy/reports/admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&agentName=AgentX
// exports.getAdminReport = async (req, res) => {
//   try {
//     const admin = req.user;

//     if (!admin || admin.role !== "ADMIN") {
//       return res.status(403).json({ message: "Only admin can access this report" });
//     }

//     const { fromDate, toDate, agentName } = req.query;
//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "fromDate and toDate are required" });
//     }

//     const agentFilter = agentName ? { agentName } : {};

//     const policies = await UnderWritingPolicy.findAll({
//       where: {
//         branchId: admin.branchId,
//         createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
//       },
//       include: [
//         { model: Agent, where: agentFilter, attributes: ["id", "agentName", "email"] },
//         { model: User, attributes: ["id", "name", "email"] }, // Admin
//         { model: Branch, attributes: ["id", "name"] },
//       ],
//       order: [["agentId", "ASC"], ["createdAt", "ASC"]],
//     });

//     const grouped = {};
//     policies.forEach(p => {
//       const agent = p.Agent?.agentName || "Unassigned";
//       if (!grouped[agent]) grouped[agent] = [];

//       grouped[agent].push({
//         policyNumber: p.policyNumber,
//         passportNo: p.passportNo,
//         policyAmount: p.policyAmount,
//         postStatus: p.postStatus,
//         paymentStatus: p.paymentStatus,
//         createdAt: p.createdAt,
//       });
//     });

//     res.json({ success: true, data: grouped });

//   } catch (error) {
//     console.error("ADMIN REPORT ERROR", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getAdminReport = async (req, res) => {
//   try {
//     const admin = req.user;

//     if (!admin || admin.role !== "ADMIN") {
//       return res.status(403).json({ message: "Only admin can access this report" });
//     }

//     const { fromDate, toDate, agentName } = req.query;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "fromDate and toDate are required" });
//     }

//     const agentFilter = agentName ? { agentName } : {};

//     const policies = await UnderWritingPolicy.findAll({
//       where: {
//         branchId: admin.branchId, //  only admin own branch
//         createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
//       },
//       include: [
//         { model: Agent, where: agentFilter, attributes: ["id", "agentName", "email"] },
//         { model: User, attributes: ["id", "name"] },
//         { model: Branch, attributes: ["id", "name"] },
//       ],
//       order: [["agentId", "ASC"], ["createdAt", "ASC"]],
//     });

//     const grouped = {};

//     policies.forEach(p => {
//       const agent = p.Agent?.agentName || "Unassigned";

//       if (!grouped[agent]) grouped[agent] = [];

//       // convert sequelize to plain object
//       const policyData = p.toJSON();

//       //  remove extra nested objects
//       delete policyData.Branch;
//       delete policyData.User;
//       delete policyData.Agent;

//       grouped[agent].push({
//         agentName: agent,
//         policy: policyData   //FULL POLICY OBJECT
//       });
//     });

//     res.json({ success: true, data: grouped });

//   } catch (error) {
//     console.error("ADMIN REPORT ERROR", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getAdminReport = async (req, res) => {
  try {
    const user = req.user;

    if (!user || (user.role !== "ADMIN" && user.role !== "AGENT")) {
      return res.status(403).json({ message: "Only admin or agent allowed" });
    }

    const { fromDate, toDate, agentName } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "fromDate and toDate are required" });
    }

    const whereCondition = {
      createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
    };

    // 🔥 ADMIN → apni branch ka data
    if (user.role === "ADMIN") {
      whereCondition.branchId = user.branchId;
    }

    // 🔥 AGENT → sirf apni policies
    if (user.role === "AGENT") {
      whereCondition.agentId = user.agentId; 
    }

    const agentFilter =
      user.role === "ADMIN" && agentName ? { agentName } : {};

    const policies = await UnderWritingPolicy.findAll({
      where: whereCondition,
      include: [
        { model: Agent, where: agentFilter, attributes: ["id", "agentName"] },
        { model: User, attributes: ["id", "name"] },
        { model: Branch, attributes: ["id", "name"] },
      ],
      order: [["agentId", "ASC"], ["createdAt", "ASC"]],
    });

    const grouped = {};

    // 🔥 SUMMARY
    let totalPolicies = 0;
    let paidPoliciesCount = 0;
    let cancelledPoliciesCount = 0;
    let totalPaidAmount = 0;

    policies.forEach(p => {
      const agent = p.Agent?.agentName || "Unassigned";

      totalPolicies++;

      if (p.paymentStatus === "PAID") {
        paidPoliciesCount++;
        totalPaidAmount += Number(p.policyAmount || 0);
      }

      if (p.postStatus === "CANCELLED") {
        cancelledPoliciesCount++;
      }

      if (!grouped[agent]) grouped[agent] = [];

      const policyData = p.toJSON();
      delete policyData.Branch;
      delete policyData.User;
      delete policyData.Agent;

      grouped[agent].push({
        agentName: agent,
        policy: policyData
      });
    });

    res.json({
      success: true,
      summary: {
        fromDate,
        toDate,
        totalPolicies,
        paidPoliciesCount,
        cancelledPoliciesCount,
        totalPaidAmount
      },
      data: grouped
    });

  } catch (error) {
    console.error("ADMIN REPORT ERROR", error);
    res.status(500).json({ message: error.message });
  }
};


// GET /api/policy/reports/super-admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&branchName=BranchA
// exports.getSuperAdminReport = async (req, res) => {
//   try {
//     const { fromDate, toDate, branchName } = req.query;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "fromDate and toDate are required" });
//     }

//     // Build branch filter if provided
//     const branchFilter = branchName ? { name: branchName } : {};

//     const policies = await UnderWritingPolicy.findAll({
//       where: {
//         createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
//       },
//       include: [
//         { model: Branch, where: branchFilter, attributes: ["id", "name"] },
//         { model: User, attributes: ["id", "name", "email"] }, // Admin
//         { model: Agent, attributes: ["id", "agentName", "email"] },
//       ],
//       order: [["adminId", "ASC"], ["branchId", "ASC"], ["createdAt", "ASC"]],
//     });

//     // Group by adminName
//     const grouped = {};
//     policies.forEach(p => {
//       const adminName = p.User.name;
//       const branchName = p.Branch.name;

//       if (!grouped[adminName]) grouped[adminName] = [];

//       grouped[adminName].push({
//         branchName,
//         policyNumber: p.policyNumber,
//         agentName: p.Agent?.agentName || null,
//         passportNo: p.passportNo,
//         policyAmount: p.policyAmount,
//         postStatus: p.postStatus,
//         paymentStatus: p.paymentStatus,
//         createdAt: p.createdAt,
//       });
//     });

//     res.json({ success: true, data: grouped });

//   } catch (error) {
//     console.error("SUPER ADMIN REPORT ERROR", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// GET /api/policy/reports/super-admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
// GET /api/policy/reports/super-admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&branchName=BranchA&adminName=Admin1&agentName=AgentX


// exports.getSuperAdminReport = async (req, res) => {
//   try {
//     const { fromDate, toDate, branchName, adminName, agentName } = req.query;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "fromDate and toDate are required" });
//     }

//     const branchFilter = branchName ? { name: branchName } : {};
//     const adminFilter = adminName ? { name: adminName } : {};
//     const agentFilter = agentName ? { agentName: agentName } : {};

//     const policies = await UnderWritingPolicy.findAll({
//       where: {
//         createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
//       },
//       include: [
//         { model: Branch, where: branchFilter, attributes: ["id", "name"] },
//         { model: User, where: adminFilter, attributes: ["id", "name", "email"] },
//         { model: Agent, where: agentFilter, attributes: ["id", "agentName", "email"] },
//       ],
//       order: [["adminId", "ASC"], ["branchId", "ASC"], ["createdAt", "ASC"]],
//     });

//     const grouped = {};

//     policies.forEach(p => {
//       const adminName = p.User.name;
//       const branchName = p.Branch.name;
//       const agentName = p.Agent?.agentName || null;

//       if (!grouped[adminName]) grouped[adminName] = [];

//       // convert sequelize object to plain
//       const policyData = p.toJSON();

//       // ❌ remove extra nested objects
//       delete policyData.Branch;
//       delete policyData.User;
//       delete policyData.Agent;

//       grouped[adminName].push({
//         branchName,
//         adminName,
//         agentName,
//         policy: policyData
//       });
//     });

//     res.json({ success: true, data: grouped });

//   } catch (error) {
//     console.error("SUPER ADMIN REPORT ERROR", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getSuperAdminReport = async (req, res) => {
  try {
    const { fromDate, toDate, branchName, adminName, agentName } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "fromDate and toDate are required" });
    }

    const branchFilter = branchName ? { name: branchName } : {};
    const adminFilter = adminName ? { name: adminName } : {};
    const agentFilter = agentName ? { agentName: agentName } : {};

    const policies = await UnderWritingPolicy.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(fromDate), new Date(toDate)]
        }
      },
      include: [
        { model: Branch, where: branchFilter, attributes: ["id", "name"] },
        { model: User, where: adminFilter, attributes: ["id", "name", "email"] },
        { model: Agent, where: agentFilter, attributes: ["id", "agentName", "email"] }
      ],
      order: [["adminId", "ASC"], ["branchId", "ASC"], ["createdAt", "ASC"]]
    });

    const grouped = {};

    // 🔥 GRAND TOTAL VARIABLES
    let totalPolicies = 0;
    let totalPaidAmount = 0;
    let paidPoliciesCount = 0;
    let cancelledPoliciesCount = 0;

    policies.forEach(p => {
      const adminName = p.User.name;
      const branchName = p.Branch.name;
      const agentName = p.Agent?.agentName || null;

      // ---- totals ----
      totalPolicies++;

      if (p.paymentStatus === "PAID") {
        paidPoliciesCount++;
        totalPaidAmount += Number(p.policyAmount || 0);
      }

      if (p.postStatus === "CANCELLED") {
        cancelledPoliciesCount++;
      }

      if (!grouped[adminName]) grouped[adminName] = [];

      const policyData = p.toJSON();
      delete policyData.Branch;
      delete policyData.User;
      delete policyData.Agent;

      grouped[adminName].push({
        branchName,
        adminName,
        agentName,
        policy: policyData
      });
    });

    res.json({
      success: true,

      // 🔥 GRAND TOTAL SECTION
      summary: {
        fromDate,
        toDate,
        totalPolicies,
        paidPoliciesCount,
        cancelledPoliciesCount,
        totalPaidAmount
      },

      // detailed data
      data: grouped
    });

  } catch (error) {
    console.error("SUPER ADMIN REPORT ERROR", error);
    res.status(500).json({ message: error.message });
  }
};

// all branch and admin report 
// GET http://localhost:5000/api/policy/reports/super-admin?fromDate=2026-01-01&toDate=2026-02-04

// specific branch report 
// GET http://localhost:5000/api/policy/reports/super-admin?fromDate=2026-01-01&toDate=2026-02-04&branchName=BranchA

// specific admin report
// GET http://localhost:5000/api/policy/reports/super-admin?fromDate=2026-01-01&toDate=2026-02-04&adminName=Admin1

// specific agent 
// GET http://localhost:5000/api/policy/reports/super-admin?fromDate=2026-01-01&toDate=2026-02-04&agentName=AgentX

// Combine filters (branch + admin + agent)
// GET http://localhost:5000/api/policy/reports/super-admin?fromDate=2026-01-01&toDate=2026-02-04&branchName=BranchA&adminName=Admin1&agentName=AgentX
