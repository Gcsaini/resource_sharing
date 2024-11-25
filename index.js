import express from "express";
import userRoutes from "./routes/user.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
const env = dotenv;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

env.config({ path: "./.env" });

global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to project",
    status: true,
    data: {},
  });
});

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected.");
  app.listen(process.env.PORT, () =>
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
  );
});
