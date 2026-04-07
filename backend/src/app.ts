import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/env';
import errorMiddleware from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import applicationRoutes from './modules/applications/application.routes';
import aiRoutes from './modules/ai/ai.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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