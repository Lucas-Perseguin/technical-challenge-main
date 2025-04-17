import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./config/mongo.js";
import motoristaRouter from "./routes/motoristaRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";
import veiculoRouter from "./routes/veiculoRouter.js";
import viagemRouter from "./routes/viagemRouter.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
await connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/motoristas", motoristaRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/veiculos", veiculoRouter);
app.use("/api/viagens", viagemRouter);

export default app;
