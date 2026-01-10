const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!req.body || !name || !email || !password) {
    return res.status(400).json({
      message: "Required value missing",
    });
  }

  const isUserAlreadyExist = await UserModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist please login",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    return res.status(400).json({
      message: "Something went wrong user not register",
    });
  }

  // Generate both access and refresh tokens
  const {
    generateAccessToken,
    generateRefreshToken,
  } = require("../utils/tokenUtils");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // Set tokens as HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    message: "User created successfully",
    newUser: { name: user.name, email: user.email },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!req.body || !email || !password) {
    return res.status(400).json({
      message: "Required value missing",
    });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // Generate both access and refresh tokens
  const {
    generateAccessToken,
    generateRefreshToken,
  } = require("../utils/tokenUtils");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // Set tokens as HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ message: "User logged in successfully" });
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Clear refresh token from database
      await UserModel.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    // Clear both cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    const { verifyRefreshToken } = require("../utils/tokenUtils");
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // Check if refresh token exists in database
    const user = await UserModel.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const { generateAccessToken } = require("../utils/tokenUtils");
    const newAccessToken = generateAccessToken(user._id);

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error refreshing token",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, emailNotifications, webNotifications } = req.body;
    const userId = req.user.id;

    if (!name && !email && !req.file) {
      return res.status(400).json({
        message: "Please provide name, email, or profile picture to update",
      });
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (emailNotifications !== undefined)
      updateData.emailNotifications = emailNotifications;
    if (webNotifications !== undefined)
      updateData.webNotifications = webNotifications;

    // Handle profile picture update
    if (req.file) {
      // Create full URL for the image
      const protocol = req.protocol;
      const host = req.get("host");
      const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      updateData.profilePicture = fullUrl;
    }

    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide current and new password",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    // Normalize email
    const normalizedEmail = email.trim(); // optional .toLowerCase() if you want

    // Case-insensitive search
    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save to database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

    // Message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    // Send email (Mock or Real)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // Your Gmail App Password
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Password Reset Token",
          text: message,
        });
      } else {
        console.log("----------------------------------------------------");
        console.log("MOCK EMAIL SENDER (Configure .env for real emails)");
        console.log(`To: ${user.email}`);
        console.log(`Subject: Password Reset Token`);
        console.log(`Message: \n${message}`);
        console.log("----------------------------------------------------");
      }

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error processing forgot password",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Please provide a new password" });
    }

    // Hash token to match database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
