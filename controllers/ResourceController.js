import Resource from "../models/resource.js";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export const createResource = async (req, res) => {
  try {
    const { resource_url, expiration_time } = req.body;
    if (!resource_url) {
      return res.status(400).json({
        message: "resource_url is required",
        data: {},
      });
    }
    if (!expiration_time) {
      return res.status(400).json({
        message: "Expiration_time is required",
        data: {},
      });
    }
    const userId = req.user.id;
    const access_token = uuidv4();
    const expirationDate = new Date(expiration_time);

    if (!validator.isURL(resource_url)) {
      return res
        .status(400)
        .json({ message: "Invalid resource URL format", data: {} });
    }

    if (isNaN(expirationDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid expiration time format", data: {} });
    }
    if (expirationDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Expiration time must be in the future", data: {} });
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
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResources = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

export const getResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);

    if (!resource || resource.is_expired) {
      return res
        .status(404)
        .json({ message: "Resource not found or expired", status: false });
    }

    res.status(200).json({
      message: "Fetched successfully",
      data: { resource },
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.id;

    const resource = await Resource.findByPk(resourceId);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.user_id !== userId) {
      return res.status(403).json({
        message: "Unauthorized to delete this resource",
        data: {},
        status: false,
      });
    }

    await resource.destroy();

    res.status(200).json({
      message: "Resource deleted successfully",
      data: {},
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};
