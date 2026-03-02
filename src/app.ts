import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { errorHandler } from './middlewares/error';
import {router} from './routes';
import path from 'path';


const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3002', 'http://127.0.0.1:3000','https://espacio-v.vercel.app'], // Allow your frontend origins
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Allow images to be loaded from other origins
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(express.json({limit:'1mb'}));
app.use(rateLimit({windowMs:60_000, max:120}));

// Static files for uploaded images
app.use('/images', express.static(path.resolve(process.cwd(), 'uploads', 'images')));

// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', router);
app.use(errorHandler);

export default app;