import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb } from "./config/mongo.js";
import motoristaRouter from "./routes/motoristaRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";
import veiculoRouter from "./routes/veiculoRouter.js";

connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/motoristas", motoristaRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/veiculos", veiculoRouter);

export default app;
