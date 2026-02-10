const router = require("express").Router();
const {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentsByBranchId,
  reactivateAgent,
  getMyAgentProfile
} = require("../controllers/agentController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// ADMIN only routes
router.post("/", auth, authorize("ADMIN"), createAgent);
router.get("/", auth, authorize("ADMIN","SUPER_ADMIN"), getAllAgents);
router.get("/:id", auth, authorize("ADMIN","AGENT","SUPER_ADMIN"), getMyAgentProfile);
router.get(
  "/branch/:branchId",
  auth, authorize("ADMIN","SUPER_ADMIN"),
  getAgentsByBranchId
);
router.put("/:id/reactivate", auth, authorize("SUPER_ADMIN"), reactivateAgent);


router.put("/:id", auth, authorize("SUPER_ADMIN"), updateAgent);
router.delete("/:id", auth, authorize("SUPER_ADMIN"), deleteAgent);

module.exports = router;
