import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // ✅ THIS IS IMPORTANT
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
