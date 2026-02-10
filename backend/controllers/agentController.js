const { Agent, User, sequelize } = require("../models");
const { hashPassword } = require("../utils/password");
const { handleSequelizeError } = require("../utils/sequelizeError");
const { generateAgentCode } = require("../utils/agentCodeGenerator");

// exports.createAgent = async (req, res) => {
//   const {
//     agentName,
//     mobileNo,
//     email,
//     agentCnic,          
//     dateOfEstablishment,
//     dateOfOpening,
//     password
//   } = req.body;

//   if (!agentName || !email || !password || !agentCnic) {
//     return res.status(400).json({ message: "Required fields missing" });
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     //  Email duplicate check
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       await transaction.rollback();
//       return res.status(409).json({ message: "User with this email already exists" });
//     }

//     //  CNIC duplicate check
//     const existingAgent = await Agent.findOne({ where: { agentCnic } });
//     if (existingAgent) {
//       await transaction.rollback();
//       return res.status(409).json({ message: "Agent with this CNIC already exists" });
//     }

//     const hashedPassword = await hashPassword(password);

//     //  Generate agent code
//     const agentCode = await generateAgentCode(transaction);

//     const agent = await Agent.create(
//       {
//         agentCode,
//         agentName,
//         mobileNo,
//         email,
//         agentCnic,                //  save CNIC
//         dateOfEstablishment,
//         dateOfOpening,
//         password: hashedPassword,
//         adminId: req.user.id
//       },
//       { transaction }
//     );

//     const user = await User.create(
//       {
//         name: agentName,
//         email,
//         password: hashedPassword,
//         role: "AGENT"
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(201).json({
//       message: "Agent created successfully"
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);

//     res.status(400).json({
//       message: handleSequelizeError(error)
//     });
//   }
// };

// GET all agents for the admin

exports.createAgent = async (req, res) => {

  const {
    agentName,
    mobileNo,
    email,
    agentCnic,
    dateOfEstablishment,
    dateOfOpening,
    password,
      city,       
    address ,
     commissionSlab 
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    //  Get admin (from token)
    const admin = await User.findByPk(req.user.id);

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can create agent" });
    }

    if (!admin.branchId) {
      return res.status(400).json({ message: "Admin is not linked with any branch" });
    }

    //  Generate agent code
    const agentCode = await generateAgentCode(transaction);
    const hashedPassword = await hashPassword(password);

    //  CREATE AGENT (branchId AUTO)
    const agent = await Agent.create({
      agentCode,
      agentName,
      mobileNo,
      email,
      agentCnic,
      dateOfEstablishment,
      dateOfOpening,
       city,         
      address ,
       commissionSlab,
      password: hashedPassword,
      adminId: admin.id,
      branchId: admin.branchId   //  KEY LINE
    }, { transaction });

    //  CREATE USER (AGENT) WITH SAME branchId
    await User.create({
      name: agentName,
      email,
      password: hashedPassword,
      role: "AGENT",
      branchId: admin.branchId   //  KEY LINE
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: "Agent created successfully",
      agentCode: agent.agentCode
    });

  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: handleSequelizeError(error) });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      where: { adminId: req.user.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }]
    });

    if (!agents.length) {
      return res.json({ message: "No agents found", agents: [] });
    }

    res.json({ agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
};



// GET agent by ID (only admin's agents)
// exports.getAgentById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const agent = await Agent.findOne({
//       where: { id, adminId: req.user.id },
//       include: [{ model: User, attributes: ["id", "name", "email"] }]
//     });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     res.json({ agent });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch agent" });
//   }
// };

// exports.getMyAgentProfile = async (req, res) => {
//   try {
//     // if (req.user.role !== "AGENT") {
//     //   return res.status(403).json({ message: "Unauthorized" });
//     // }

//     const agent = await Agent.findOne({
//       where: { id: req.user.agentId },
//       include: [{ model: User, attributes: ["id", "name", "email"] }],
//     });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     res.json({ agent });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch agent profile" });
//   }
// };
exports.getMyAgentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findOne({
      where: { id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch agent profile" });
  }
};
// GET agents by branch ID (ADMIN only)
// exports.getAgentsByBranchId = async (req, res) => {
//   const { branchId } = req.params;

//   try {
//     const agents = await Agent.findAll({
//       where: {
//         branchId,
//         adminId: req.user.id   //  admin restriction
//       },
//       include: [
//         {
//           model: User,
//           attributes: ["id", "name", "email"]
//         }
//       ]
//     });

//     if (!agents.length) {
//       return res.json({
//         message: "No agents found for this branch",
//         agents: []
//       });
//     }

//     res.json({ agents });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to fetch agents by branch"
//     });
//   }
// };


exports.getAgentsByBranchId = async (req, res) => {
  const { branchId } = req.params;
  const userRole = req.user.role;

  try {
    let whereCondition = { branchId: branchId };

   
    // SUPER_ADMIN sees all agents in branch → no adminId restriction

    const agents = await Agent.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        }
      ]
    });

    if (!agents.length) {
      return res.json({
        message: "No agents found for this branch",
        agents: []
      });
    }

    res.json({ agents });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch agents by branch"
    });
  }
};
// UPDATE agent (ADMIN only, token check)
// exports.updateAgent = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const agent = await Agent.findOne({
//       where: { id, adminId: req.user.id }
//     });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // 🔹 Email already used?
//     if (updates.email && updates.email !== agent.email) {
//       const emailUsed = await User.findOne({ where: { email: updates.email } });
//       if (emailUsed) {
//         return res.status(409).json({ message: "Email already in use" });
//       }
//     }

//     // Sync User
//     await User.update(
//       {
//         ...(updates.agentName && { name: updates.agentName }),
//         ...(updates.email && { email: updates.email })
//       },
//       { where: { email: agent.email } }
//     );

//     await agent.update(updates);

//     res.json({ message: "Agent updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: handleSequelizeError(error) });
//   }
// };

exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    //  SUPER_ADMIN can update ANY agent
    const agent = await Agent.findByPk(id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    //  Email already used?
    if (updates.email && updates.email !== agent.email) {
      const emailUsed = await User.findOne({ where: { email: updates.email } });
      if (emailUsed) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    //  Sync User table
    await User.update(
      {
        ...(updates.agentName && { name: updates.agentName }),
        ...(updates.email && { email: updates.email }),
          ...(updates.commissionSlab && { commissionSlab: updates.commissionSlab })

      },
      { where: { email: agent.email } }
    );

    await agent.update(updates);

    res.json({
      success: true,
      message: "Agent updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: handleSequelizeError(error) });
  }
};

exports.reactivateAgent = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const agent = await Agent.findByPk(id, { transaction });

    if (!agent) {
      await transaction.rollback();
      return res.status(404).json({ message: "Agent not found" });
    }

    // 1️⃣ Agent active
    await agent.update({ isActive: true }, { transaction });

    // 2️⃣ Related USER active
    await User.update(
      { isActive: true },
      { where: { email: agent.email }, transaction }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Agent reactivated successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: handleSequelizeError(error)
    });
  }
};



// DELETE agent (ADMIN only, token check)
// exports.deleteAgent = async (req, res) => {
//   const { id } = req.params;
//   const transaction = await sequelize.transaction();

//   try {
//     const agent = await Agent.findOne({
//       where: { id, adminId: req.user.id }
//     });

//     if (!agent) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     await User.destroy(
//       { where: { email: agent.email } },
//       { transaction }
//     );

//     await agent.destroy({ transaction });

//     await transaction.commit();

//     res.json({ message: "Agent deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete agent" });
//   }
// };
exports.deleteAgent = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const agent = await Agent.findByPk(id, { transaction });

    if (!agent) {
      await transaction.rollback();
      return res.status(404).json({ message: "Agent not found" });
    }

await agent.update({ isActive: false });
await User.update(
  { isActive: false },
  { where: { email: agent.email } }
);


    await transaction.commit();

    res.json({
      success: true,
      message: "Agent deleted successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Failed to delete agent" });
  }
};


