const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/worldWideController");

router.post("/", auth, controller.createPackage);     // SUPER_ADMIN
router.get("/", controller.getAllPackages);           // Public
router.get("/:id", controller.getPackageById);        // Public
router.put("/:id", auth, controller.updatePackage);   // SUPER_ADMIN
router.delete("/:id", auth, controller.deletePackage);// SUPER_ADMIN

module.exports = router;
