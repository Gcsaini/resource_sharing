import Jwt from "jsonwebtoken";
export const generateToken = (id) => {
  const payload = {
    userId: id,
  };
  return Jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
