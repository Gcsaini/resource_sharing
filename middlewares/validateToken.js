import Resource from "../models/resource.js";

export default async function validateAccessToken(req, res, next) {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    const resource = await Resource.findOne({ where: { access_token: token } });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const currentDate = new Date();
    if (resource.expiration_time < currentDate) {
      return res.status(400).json({
        message: "Trying to access an expired resource",
        status: false,
      });
    }
    req.resource = resource;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error validating access token",
      error: error.message,
      status: false,
    });
  }
}
