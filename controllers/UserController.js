import { generateToken } from "../helpers/generate.js";
import User from "../models/users.js";
import Joi from "joi";
export const register = async (req, res, next) => {
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
      const error = new Error("Account is already exists");
      error.statusCode = 404;
      return next(error);
    }
    const newuser = await User.create({ name, email });

    if (!newuser) {
      const error = new Error(
        "Failed to create user please try again after some time."
      );
      error.statusCode = 500;
      return next(error);
    }

    res.status(201).json({
      message: "User registered successfully! You may login now.",
      data: {
        name: newuser.name,
        email: newuser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
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
      const error = new Error("Account dose not exists.");
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user.id);
    res
      .status(200)
      .json({ message: "Login successful", data: { token: token } });
  } catch (error) {
    next(error);
  }
};
