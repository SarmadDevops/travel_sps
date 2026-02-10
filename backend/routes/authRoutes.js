const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/login", authController.login);
router.post("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
