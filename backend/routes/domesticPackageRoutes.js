const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createDomesticPackage,
  getAllDomesticPackages,
  getDomesticPackageById,
  updateDomesticPackage,
  deleteDomesticPackage
} = require("../controllers/domesticPackageController");

// Public routes
router.get("/", getAllDomesticPackages);
router.get("/:id", getDomesticPackageById);

// SUPER_ADMIN routes
router.post("/", authMiddleware, createDomesticPackage);
router.put("/:id", authMiddleware, updateDomesticPackage);
router.delete("/:id", authMiddleware, deleteDomesticPackage);

module.exports = router;
