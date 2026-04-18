import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-tracker',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  
  // Groq Cloud API Key
  groqApiKey: process.env.GROQ_API_KEY || '',

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
