import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/env';
import errorMiddleware from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import applicationRoutes from './modules/applications/application.routes';
import aiRoutes from './modules/ai/ai.routes';
import { helmetMiddleware, generalLimiter } from './middleware/security.middleware';
import { sanitizeInput } from './middleware/validation.middleware';

const app: Application = express();

app.use(helmetMiddleware);
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(generalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeInput);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorMiddleware);

export default app;