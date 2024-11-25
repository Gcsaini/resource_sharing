import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {
  let token;

  // Check if authorization header contains a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = Jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.userId, {
        attributes: ["name", "email"],
      });

      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(403).json({ message: "User not authorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Token validation failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token not found" });
  }
};
