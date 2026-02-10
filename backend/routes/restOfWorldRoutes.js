const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} = require("../controllers/restOfWorldController");

// CRUD
router.post("/", auth, createPackage);          // SUPER_ADMIN only
router.get("/", getAllPackages);               // Public
router.get("/:id", getPackageById);           // Public
router.put("/:id", auth, updatePackage);      // SUPER_ADMIN only
router.delete("/:id", auth, deletePackage);   // SUPER_ADMIN only

module.exports = router;
