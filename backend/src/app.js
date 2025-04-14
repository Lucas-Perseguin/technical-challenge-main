import 'dotenv/config';
import express from 'express';
import { connectDb } from './config/mongo.js';
import motoristaRoute from './routes/motoristaRoute.js';
import cors from 'cors';

connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/motoristas', motoristaRoute);

export default app;
