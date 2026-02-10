const { Branch, User,Agent, sequelize } = require("../models");
const { hashPassword } = require("../utils/password");
const { handleSequelizeError } = require("../utils/sequelizeError");
const { generateBranchCode } = require("../utils/branchCodeGenerator");

exports.createBranchWithAdmin = async (req, res) => {
  const {
    name,
    city,
    branchPhone,
    branchAddress,
    branchOfficialEmail,
    branchDateOfOpening,
    adminName,
    adminEmail,
    adminPassword,
    adminContactNo,
    adminCnic,
    creditTrial,
    commissionSlab
  } = req.body;

  if (!name || !adminName || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const transaction = await sequelize.transaction();

  try {
    //  Check admin email
    const existingUser = await User.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    //  Check branch official email
    const existingBranch = await Branch.findOne({
      where: { branchOfficialEmail }
    });
    if (existingBranch) {
      await transaction.rollback();
      return res.status(409).json({ message: "Branch with this official email already exists" });
    }

    //  Generate 3-digit branch code
    const branchCode = await generateBranchCode(transaction);

    //  Create branch
    const branch = await Branch.create(
      {
        name,
        city,
        branchCode,
        branchPhone,
        branchAddress,
        branchOfficialEmail,
        branchDateOfOpening,
        adminContactNo,
        adminCnic,
        creditTrial,                // input
    remainingBalance: creditTrial, // AUTO
    issuedPolicyAmount: 0,     
        commissionSlab
      },
      { transaction }
    );

    //  Hash password
    const hashedPassword = await hashPassword(adminPassword);

    //  Create admin user
    const adminUser = await User.create(
      {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        branchId: branch.id,
        isActive: true
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Branch and admin created successfully",
      data: {
        branch,
        admin: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        }
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(400).json({ message: handleSequelizeError(error) });
  }
};


exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      include: [
        {
          model: User,
          where: { role: "ADMIN" },
          attributes: ["id", "name", "email", "role"],
          required: false, 
        },
      ],
    });

    res.status(200).json({ branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET all agents of a branch (SUPER_ADMIN only)
exports.getAgentsByBranch = async (req, res) => {



  try {
    const branchId = req.params.branchId;

    // 1 Get all admins of this branch
    const admins = await User.findAll({
      where: { branchId, role: "ADMIN" },
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Agent,
          attributes: ["id", "agentName", "email", "mobileNo", "dateOfEstablishment", "dateOfOpening"],
        },
      ],
    });

    // Prepare response
    const result = admins.map((admin) => ({
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      agents: admin.Agents, // all agents under this admin
    }));

    // Optional: total agents in branch
    const totalAgents = result.reduce((acc, admin) => acc + admin.agents.length, 0);

    res.status(200).json({
      branchId,
      totalAgents,
      admins: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 
// get branch by id 
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        {
          model: User,
          where: { role: "ADMIN" },
          attributes: ["id", "name", "email", "role", "isActive"],
          required: false, // safety: agar admin missing ho
        },
      ],
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// GET financial info of the logged-in user's branch
exports.getMyBranchFinancial = async (req, res) => {
  try {
    // Assuming branchId comes from logged-in user token
    const branchId = req.user.branchId;

    if (!branchId) {
      return res.status(400).json({ success: false, message: "Branch info not available" });
    }

    const branch = await Branch.findByPk(branchId, {
      attributes: ["id", "name", "creditTrial", "remainingBalance", "issuedPolicyAmount"]
    });

    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    res.status(200).json({
      success: true,
      data: branch
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//  UPDATE branch by ID

exports.updateBranchById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const transaction = await sequelize.transaction();

  try {
    // 1 Find branch
    const branch = await Branch.findByPk(id, { transaction });
    if (!branch) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    // 2 Find related admin users
    const adminUsers = await User.findAll({
      where: { branchId: branch.id, role: "ADMIN" },
      transaction
    });

    if (!adminUsers.length) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "No admin users found for this branch" });
    }

    // 3 Check if admin email is being updated
    if (updates.adminEmail) {
      // Check if any other user already has this email
      const emailUsed = await User.findOne({
        where: { email: updates.adminEmail },
        transaction
      });

      // If email exists and it's not one of the current admins, block
      if (emailUsed && !adminUsers.some(admin => admin.id === emailUsed.id)) {
        await transaction.rollback();
        return res.status(409).json({ success: false, message: "Email already in use by another user" });
      }
    }

    // 4 Update branch fields (exclude admin-specific fields)
    const branchUpdates = { ...updates };
    delete branchUpdates.adminName;
    delete branchUpdates.adminEmail;

    await branch.update(branchUpdates, { transaction });

    // 5 Update admin users fields if provided
    const adminUpdates = {};
    if (updates.adminName) adminUpdates.name = updates.adminName;
    if (updates.adminEmail) adminUpdates.email = updates.adminEmail;

    if (Object.keys(adminUpdates).length > 0) {
      await User.update(adminUpdates, {
        where: { branchId: branch.id, role: "ADMIN" },
        transaction
      });
    }

    await transaction.commit();

    // 6 Fetch updated branch with admins for response
    const updatedBranch = await Branch.findByPk(branch.id, {
      include: [
        {
          model: User,
          where: { role: "ADMIN" },
          attributes: ["id", "name", "email", "role"],
          required: false
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Branch and admin(s) updated successfully",
      data: updatedBranch
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(400).json({ success: false, message: handleSequelizeError(error) });
  }
};


exports.reactivateBranchById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const branch = await Branch.findByPk(req.params.id, { transaction });

    if (!branch) {
      await transaction.rollback();
      return res.status(404).json({ message: "Branch not found" });
    }

    // 1️⃣ Branch active
    await branch.update({ isActive: true }, { transaction });

    // 2️⃣ All admins active
    await User.update(
      { isActive: true },
      { where: { branchId: branch.id }, transaction }
    );

    // 3️⃣ All agents active
    await Agent.update(
      { isActive: true },
      { where: { branchId: branch.id }, transaction }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Branch reactivated successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: handleSequelizeError(error) });
  }
};

// exports.deleteBranchById = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const branch = await Branch.findByPk(req.params.id);
//     if (!branch) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Branch not found" });
//     }

//     // Optional: Delete all admins + agents under branch
//     const admins = await User.findAll({ where: { branchId: branch.id, role: "ADMIN" } });

//     for (const admin of admins) {
//       await Agent.destroy({ where: { adminId: admin.id }, transaction });
//       await admin.destroy({ transaction });
//     }

//     await branch.destroy({ transaction });

//     await transaction.commit();

//     res.status(200).json({ success: true, message: "Branch, admins, and agents deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     res.status(500).json({ message: handleSequelizeError(error) });
//   }
// };

// exports.deleteBranchById = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const branch = await Branch.findByPk(req.params.id);
//     if (!branch) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Branch not found" });
//     }

//     //  Get all admins of branch
//     const admins = await User.findAll({
//       where: { branchId: branch.id, role: "ADMIN" },
//       transaction
//     });

//     for (const admin of admins) {
//       //  Get agents of this admin
//       const agents = await Agent.findAll({
//         where: { adminId: admin.id },
//         transaction
//       });

//       for (const agent of agents) {
//         // Delete agent USER
//         await User.destroy({
//           where: { email: agent.email },
//           transaction
//         });

//         //  Delete agent record
//         await agent.destroy({ transaction });
//       }

//       //  Delete admin user
//       await admin.destroy({ transaction });
//     }

//     //  Delete branch
//     await branch.destroy({ transaction });

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       message: "Branch, admins, agents and agent users deleted successfully"
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     res.status(500).json({ message: handleSequelizeError(error) });
//   }
// };


exports.deactivateBranchById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const branch = await Branch.findByPk(req.params.id, { transaction });
    if (!branch) {
      await transaction.rollback();
      return res.status(404).json({ message: "Branch not found" });
    }

    // 1 Branch inactive
    await branch.update({ isActive: false }, { transaction });

    // 2 All admins inactive
    await User.update(
      { isActive: false },
      { where: { branchId: branch.id }, transaction }
    );

    // 3 All agents inactive
    await Agent.update(
      { isActive: false },
      { where: { branchId: branch.id }, transaction }
    );

    await transaction.commit();

    res.json({
      success: true,
      message: "Branch deactivated successfully"
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: handleSequelizeError(error) });
  }
};
