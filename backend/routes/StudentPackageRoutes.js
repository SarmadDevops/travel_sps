const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const {
  createStudentPackage,
  getAllStudentPackages,
  getStudentPackageById,
  updateStudentPackage,
  deleteStudentPackage
} = require("../controllers/studentPackageController");

// SUPER_ADMIN only
router.post("/", auth,authorize("SUPER_ADMIN"), createStudentPackage);
router.put("/:id", auth, authorize("SUPER_ADMIN"),updateStudentPackage);
router.delete("/:id", auth,authorize("SUPER_ADMIN"), deleteStudentPackage);

// Public
router.get("/", getAllStudentPackages);
router.get("/:id",getStudentPackageById);

module.exports = router;
