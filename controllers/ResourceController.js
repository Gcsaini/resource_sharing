import Resource from "../models/resource.js";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export const createResource = async (req, res, next) => {
  try {
    const { resource_url, expiration_time } = req.body;
    if (!resource_url) {
      return next(new Error("Resource Url is required"));
    }
    if (!expiration_time) {
      return next(new Error("Expiration time is required"));
    }
    const userId = req.user.id;
    const access_token = uuidv4();
    const expirationDate = new Date(expiration_time);

    if (!validator.isURL(resource_url)) {
      return next(new Error("Invalid resource URL format"));
    }

    if (isNaN(expirationDate.getTime())) {
      return next(new Error("Invalid expiration time format"));
    }
    if (expirationDate <= new Date()) {
      return next(new Error("Expiration time must be in the future"));
    }

    const resource = await Resource.create({
      resource_url,
      expiration_time: expirationDate.toISOString(),
      access_token,
      user_id: userId,
    });

    res.status(201).json({
      message: "Resource created successfully",
      data: {
        resource: resource.resource_url,
        expiration_time: resource.expiration_time,
        sharing_url: `${process.env.BASE_URL}${access_token}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    let where = { user_id: userId };
    if (status) {
      if (status === "active") where.is_expired = false;
      if (status === "expired") where.is_expired = true;
    }

    const resources = await Resource.findAll({ where });
    res
      .status(200)
      .json({ message: "Fetched successfully", data: { resources } });
  } catch (error) {
    next(error);
  }
};

export const getResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);

    if (!resource || resource.is_expired) {
      return next(new Error("Resource not found or expired"));
    }

    res.status(200).json({
      message: "Fetched successfully",
      data: { resource },
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.id;

    const resource = await Resource.findByPk(resourceId);

    if (!resource) {
      return next(new Error("Resource not found"));
    }

    if (resource.user_id !== userId) {
      return next(new Error("Unauthorized resource deletion or access."));
    }

    await resource.destroy();

    res.status(200).json({
      message: "Resource deleted successfully",
      data: {},
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceByToken = async (req, res, next) => {
  const { resource } = req;

  res.status(200).json({
    message: "Resource accessed successfully",
    resource_url: resource.resource_url,
    status: true,
  });
};
