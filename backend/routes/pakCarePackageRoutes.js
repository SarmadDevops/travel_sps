const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createPakCarePackage,
  getAllPakCarePackages,
  getPakCarePackageById,
  updatePakCarePackage,
  deletePakCarePackage
} = require("../controllers/pakCarePackageController");

// Public routes
router.get("/", getAllPakCarePackages);
router.get("/:id", getPakCarePackageById);

// SUPER_ADMIN routes
router.post("/", authMiddleware, createPakCarePackage);
router.put("/:id", authMiddleware, updatePakCarePackage);
router.delete("/:id", authMiddleware, deletePakCarePackage);

module.exports = router;
