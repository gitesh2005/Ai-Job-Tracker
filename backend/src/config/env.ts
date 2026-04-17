import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-tracker',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  
  // GitHub Models Token (Student Pack)
  githubToken: process.env.GITHUB_TOKEN || '',
  
  // Purane keys (agar future mein use karne hon)
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || '', 
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
  
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
