# AI-Assisted Job Application Tracker - Backend

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key for AI parsing

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Applications
- `GET /api/applications` - Get all applications (protected)
- `POST /api/applications` - Create application (protected)
- `GET /api/applications/:id` - Get single application (protected)
- `PATCH /api/applications/:id` - Update application (protected)
- `DELETE /api/applications/:id` - Delete application (protected)
- `PATCH /api/applications/:id/status` - Update application status (protected)

### AI
- `POST /api/ai/parse-job-description` - Parse job description (protected)

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration files
│   │   ├── env.ts          # Environment variables
│   │   └── db.ts           # Database connection
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/              # Utility functions
│   │   ├── asyncHandler.ts
│   │   ├── apiError.ts
│   │   └── apiResponse.ts
│   ├── types/              # TypeScript types
│   │   └── express.d.ts
│   └── modules/            # Feature modules
│       ├── auth/
│       ├── applications/
│       └── ai/
├── package.json
├── tsconfig.json
└── .env.example
```

## Status Values

Application status can be one of:
- Applied
- Phone Screen
- Interview
- Offer
- Rejected

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
