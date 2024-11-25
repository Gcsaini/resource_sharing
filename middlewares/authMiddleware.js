import Jwt from "jsonwebtoken";
import User from "../models/users.js";

export const isAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = Jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.userId, {
        attributes: ["id", "name", "email"],
      });

      if (user) {
        req.user = user;
        next();
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
