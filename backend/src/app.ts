import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb } from "./config/mongo.js";
import motoristaRouter from "./routes/motoristaRoute.js";
import usuarioRouter from "./routes/usuarioRoute.js";

connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/motoristas", motoristaRouter);
app.use("/api/usuarios", usuarioRouter);

export default app;
