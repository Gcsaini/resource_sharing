import { generateToken } from "../helpers/generate.js";
import User from "../models/users.js";
import Joi from "joi";
export const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const { name, email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res
        .status(401)
        .json({ message: "Account is already exists", data: {} });
    }
    const newuser = await User.create({ name, email });

    res.status(201).json({
      message: "User registered successfully! You may login now.",
      data: {
        name: newuser.name,
        email: newuser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => err.message),
    });
  }
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Account dose not exists" });
    }

    const token = generateToken(user.id);
    res
      .status(200)
      .json({ message: "Login successful", data: { token: token } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
