import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile must be 10 digits",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const exists = await Users.findOne({ mobile });
    if (exists) {
      return res.status(400).json({
        message: "Mobile already registered",
      });
    }

    /* CREATE USER (password auto-hashed by schema) */
    const user = await Users.create({
      name,
      mobile,
      password,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const user = await Users.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
