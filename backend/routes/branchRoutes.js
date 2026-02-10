const router = require("express").Router();
const branchController = require("../controllers/branchController");
const authMiddleware = require("../middlewares/authMiddleware");

const authorize = require("../middlewares/roleMiddleware");
router.post("/", authMiddleware, authorize("SUPER_ADMIN"), branchController.createBranchWithAdmin);
router.get("/", authMiddleware,authorize("SUPER_ADMIN"), branchController.getAllBranches);
router.get("/agents/:branchId", authMiddleware, branchController.getAgentsByBranch);
router.get("/my-financials",authMiddleware,authorize("ADMIN"),  branchController.getMyBranchFinancial);
router.get("/:id",authMiddleware,authorize("ADMIN","SUPER_ADMIN"), branchController.getBranchById);
router.put("/:id", authMiddleware, authorize("SUPER_ADMIN"), branchController.updateBranchById);
router.put("/branches/:id/reactivate", authMiddleware, authorize("SUPER_ADMIN"), branchController.reactivateBranchById);
router.delete("/:id", authMiddleware, authorize("SUPER_ADMIN"), branchController.deactivateBranchById);
module.exports = router;
