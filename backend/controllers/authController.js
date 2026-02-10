const jwt = require("jsonwebtoken");
const { User , Agent, Branch} = require("../models");
const { comparePassword, hashPassword } = require("../utils/password");

// exports.login = async (req, res) => {
//   const { name, password } = req.body;

//   // username (name) + active user
//   const user = await User.findOne({
//     where: { 
//       name,
//       isActive: true 
//     }
//   });

//   if (!user) {
//     return res.status(401).json({ message: "Invalid name" });
//   }

//   const isMatch = await comparePassword(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid password" });
//   }

//   const token = jwt.sign(
//     {
//       id: user.id,
//       role: user.role,
//       branchId: user.branchId
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({
//     token,
//     user: {
//       id: user.id,
//       name: user.name,
//       role: user.role
//     }
//   });
// };


// exports.login = async (req, res) => {
//   const { identifier, password } = req.body;

//   if (!identifier || !password) {
//     return res.status(400).json({ message: "Identifier and password are required" });
//   }

//   try {
//     let user = null;

//     /* ---------------- 1️⃣ LOGIN VIA USER NAME ---------------- */
//     user = await User.findOne({
//       where: {
//         name: identifier,
//         isActive: true
//       }
//     });

//     /* ---------------- 2️⃣ LOGIN VIA AGENT CODE ---------------- */
//     if (!user) {
//       const agent = await Agent.findOne({
//         where: { agentCode: identifier }
//       });

//       if (agent) {
//         user = await User.findOne({
//           where: {
//             name: agent.agentName,
//             role: "AGENT",
//             isActive: true
//           }
//         });
//       }
//     }

//     /* ---------------- 3️⃣ LOGIN VIA BRANCH CODE ---------------- */
//     if (!user) {
//       const branch = await Branch.findOne({
//         where: { branchCode: identifier }
//       });

//       if (branch) {
//         user = await User.findOne({
//           where: {
//             branchId: branch.id,
//             role: "ADMIN",
//             isActive: true
//           }
//         });
//       }
//     }

//     /* ---------------- ❌ NO USER FOUND ---------------- */
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     /* ---------------- 🔐 PASSWORD CHECK ---------------- */
//     const isMatch = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     /* ---------------- 🔹 AGENT ID ---------------- */
//     let agentId = null;
//     if (user.role === "AGENT") {
//       const agent = await Agent.findOne({ where: { agentName: user.name } });
//       if (!agent) {
//         return res.status(403).json({ message: "Agent not found" });
//       }
//       agentId = agent.id;
//     }
// // after user found
// if (user.branchId) {
//   const branch = await Branch.findByPk(user.branchId);

//   if (!branch || branch.isActive === false) {
//     return res.status(403).json({
//       message: "Your branch is inactive. Please contact admin."
//     });
//   }
// }

//     /* ---------------- 🔑 TOKEN ---------------- */
//     const tokenPayload = {
//       id: user.id,
//       role: user.role,
//       branchId: user.branchId,
//       ...(agentId && { agentId }) // include agentId only if available
//     };

//     const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

//     /* ---------------- ✅ RESPONSE ---------------- */
//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//         branchId: user.branchId,
//         agentId
//       }
//     });

//   } catch (error) {
//     console.error("LOGIN ERROR 👉", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Identifier and password are required" });
  }

  try {
    let user = null;

    /* ----------------  INACTIVE USER CHECK (NEW) ---------------- */
    const inactiveUser = await User.findOne({
      where: { name: identifier, isActive: false }
    });

    if (inactiveUser) {
      return res.status(403).json({
        message: "Your account is inactive. Please contact admin."
      });
    }

    /* ---------------- 1 LOGIN VIA USER NAME ---------------- */
    user = await User.findOne({
      where: {
        name: identifier,
        isActive: true
      }
    });

    /* ---------------- 2 LOGIN VIA AGENT CODE ---------------- */
    if (!user) {
      const agent = await Agent.findOne({
        where: { agentCode: identifier }
      });

      if (agent) {
        user = await User.findOne({
          where: {
            email: agent.email,   //  SAFE
            role: "AGENT",
            isActive: true
          }
        });
      }
    }

    /* ---------------- 3 LOGIN VIA BRANCH CODE ---------------- */
    if (!user) {
      const branch = await Branch.findOne({
        where: { branchCode: identifier }
      });

      if (branch) {
        user = await User.findOne({
          where: {
            branchId: branch.id,
            role: "ADMIN",
            isActive: true
          }
        });
      }
    }

    /* ----------------  NO USER FOUND ---------------- */
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ----------------  PASSWORD CHECK ---------------- */
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------------- AGENT ID (FIXED) ---------------- */
    let agentId = null;
    if (user.role === "AGENT") {
      const agent = await Agent.findOne({
        where: { email: user.email }
      });

      if (!agent) {
        return res.status(403).json({ message: "Agent not found" });
      }

      agentId = agent.id;
    }

    /* ----------------  BRANCH INACTIVE CHECK ---------------- */
    if (user.branchId) {
      const branch = await Branch.findByPk(user.branchId);

      if (!branch || branch.isActive === false) {
        return res.status(403).json({
          message: "Your branch is inactive. Please contact admin."
        });
      }
    }

    /* ----------------  TOKEN ---------------- */
    const tokenPayload = {
      id: user.id,
      role: user.role,
      branchId: user.branchId,
      ...(agentId && { agentId })
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* ----------------  RESPONSE ---------------- */
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        agentId
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // 1 basic validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // 2 get logged in user
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 3 verify old password
  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  // 4 prevent same password
  const isSame = await comparePassword(newPassword, user.password);
  if (isSame) {
    return res.status(400).json({
      message: "New password must be different from old password"
    });
  }

  // 5 hash new password
  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password changed successfully" });
};