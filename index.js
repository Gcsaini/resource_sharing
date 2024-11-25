import express from "express";
import userRoutes from "./routes/user.js";
import resourcesRoutes from "./routes/resource.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cron from "node-cron";
import expireResources from "./cron/expiresResource.js";
import errorHandler from "./middlewares/errorMiddleware.js";
const env = dotenv;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

env.config({ path: "./.env" });

global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/resources", resourcesRoutes);
app.use(errorHandler);
app.all("*", (req, res) => {
  res.status(404).json({ message: "URL not found" });
});

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to project",
    status: true,
    data: {},
  });
});

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected.");
  cron.schedule("*/10 * * * *", async () => {
    try {
      await expireResources();
    } catch (error) {
      console.error("Error processing expired resources:", error);
    }
  });
  app.listen(process.env.PORT, () =>
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
  );
});
