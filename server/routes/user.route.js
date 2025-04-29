const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
// const authMiddleware = require("../middlewares/authMiddleware");

// router.get("/profile", authMiddleware, async (req, res) => {
//     res.status(200).json({ message: "Profile accessed", user: req.user });
// });

router.route("/signup").post(userController.register);
router.route("/login").post(userController.login);
router.route("/listUsers").get(userController.listUsers);
router.route("/delete/:userId").delete(userController.deleteUser);
router.route("/reset-password").patch(userController.resetUserPassword);
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  });
  

module.exports =  router;
    