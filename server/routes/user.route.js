const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateUser, requireAdmin } = require("../middlewares/authenticateUser");

router.route("/signup").post(userController.register);
router.route("/login").post(userController.login);

// Admin routes
router.route("/listUsers").get(authenticateUser, requireAdmin, userController.listUsers);
router.route("/delete/:userId").delete(authenticateUser, requireAdmin, userController.deleteUser);

router.route("/reset-password").patch(authenticateUser, userController.resetUserPassword);

router.get('/dashboard', authenticateUser, requireAdmin, (req, res) => {
  res.send("Welcome admin");
});


router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
