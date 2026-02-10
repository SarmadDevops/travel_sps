const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} = require("../controllers/schengenPackageController");

// Create, update, delete → require SUPER_ADMIN token
router.post("/", auth, createPackage);
router.put("/:id", auth, updatePackage);
router.delete("/:id", auth, deletePackage);

// Get all / Get by ID → public (no token)
router.get("/", getAllPackages);
router.get("/:id", getPackageById);

module.exports = router;
