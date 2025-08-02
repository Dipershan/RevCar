const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateUser, requireAdmin } = require("../middlewares/authenticateUser");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'), false);
    }
  }
});

router.route("/signup").post(userController.register);
router.route("/login").post(userController.login);

// Password reset routes
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password/:token").post(userController.resetPassword);

// Profile routes
router.route("/profile").get(authenticateUser, userController.getUserProfile);
router.route("/profile").put(authenticateUser, userController.updateUserProfile);
router.route("/profile/picture").post(authenticateUser, upload.single('profilePicture'), userController.uploadProfilePicture);
router.route("/profile/driver-license").post(authenticateUser, upload.single('driverLicense'), userController.uploadDriverLicense);
router.route("/profile/id-card").post(authenticateUser, upload.single('idCard'), userController.uploadIdCard);

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
