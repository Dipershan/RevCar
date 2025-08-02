const userService = require("../services/user.service");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register user
const register = async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Register Error:", error.message);

    if (error.message === "User already exist") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await userService.loginUser(email, password);

    res.status(200).send({
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin, // ✅ added here
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unable to Login" });
  }
};

// List all users (admin only)
const listUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ message: "Users retrieved successfully!", users });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while retrieving users",
    });
  }
};

// Reset password
const resetUserPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    await userService.resetUserPassword(email, password);
    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res
      .status(401)
      .json({ message: error.message || "An error occurred during password reset" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  console.log("Attempting to delete user with ID:", userId);

  try {
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while deleting the user",
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to get user profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    
    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        driverLicense: user.driverLicense,
        idCard: user.idCard,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if exists
    if (user.profilePicture && user.profilePicture !== '') {
      const oldFilePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.profilePicture = `uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      success: true, 
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to upload profile picture" });
  }
};

// Upload driver license
const uploadDriverLicense = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old driver license if exists
    if (user.driverLicense && user.driverLicense !== '') {
      const oldFilePath = path.join(__dirname, '..', user.driverLicense);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.driverLicense = `uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      success: true, 
      message: "Driver license uploaded successfully",
      driverLicense: user.driverLicense
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to upload driver license" });
  }
};

// Upload ID card
const uploadIdCard = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old ID card if exists
    if (user.idCard && user.idCard !== '') {
      const oldFilePath = path.join(__dirname, '..', user.idCard);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.idCard = `uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      success: true, 
      message: "ID card uploaded successfully",
      idCard: user.idCard
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to upload ID card" });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your RevCar account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

module.exports = {
  register,
  login,
  resetUserPassword,
  deleteUser,
  listUsers,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  uploadDriverLicense,
  uploadIdCard,
  forgotPassword,
  resetPassword,
};
