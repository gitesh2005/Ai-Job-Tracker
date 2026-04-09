# AI-Assisted Job Application Tracker

A full-stack MERN application that helps users track and manage their job applications with AI-powered features for parsing job descriptions and generating resume suggestions.

## Features

- **User Authentication**: Secure JWT-based registration and login
- **Kanban Board**: Visual tracking of applications across stages (Applied, Phone Screen, Interview, Offer, Rejected)
- **Drag & Drop**: Easily move applications between stages
- **AI Job Description Parser**: Paste a job description and extract company, role, skills, seniority, and location
- **Resume Suggestions**: AI-generated bullet points tailored to each job
- **Application Management**: Create, view, edit, and delete applications
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Drag & Drop**: @dnd-kit
- **HTTP Client**: Axios

## Project Structure

```
ai-job-tracker/
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Express app configuration
│   │   ├── server.ts                  # Server entry point
│   │   ├── config/
│   │   │   ├── env.ts                # Environment variables
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT authentication
│   │   │   ├── error.middleware.ts   # Error handling
│   │   │   ├── validation.middleware.ts
│   │   │   └── security.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/                 # User authentication
│   │   │   ├── applications/         # Job applications CRUD
│   │   │   └── ai/                   # AI parsing service
│   │   ├── utils/
│   │   │   ├── apiError.ts
│   │   │   ├── apiResponse.ts
│   │   │   ├── asyncHandler.ts
│   │   │   └── validation.ts
│   │   └── types/
│   │       └── express.d.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI components
│   │   │   ├── applications/         # Application form & modals
│   │   │   ├── kanban/               # Kanban board components
│   │   │   ├── common/               # Header, modal, etc.
│   │   │   └── auth/
│   │   ├── features/
│   │   │   ├── auth/                 # Auth API & hooks
│   │   │   ├── applications/         # Applications API & hooks
│   │   │   └── ai/                   # AI API & types
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/

│   │   ├── router/
│   │   ├── lib/                     # Axios client
│   │   ├── types/                   # TypeScript types
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Environment Setup

1. **Backend**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   ```

### Environment Variables

**Backend (.env)**:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-job-tracker
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Application

**Backend**:
```bash
cd backend
npm install
npm run dev     # Development
npm run build   # Production build
npm start       # Run production build
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev     # Development
npm run build   # Production build
npm run preview # Preview production build
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Applications
- `GET /api/applications` - Get all applications (protected)
- `POST /api/applications` - Create application (protected)
- `GET /api/applications/:id` - Get single application (protected)
- `PATCH /api/applications/:id` - Update application (protected)
- `DELETE /api/applications/:id` - Delete application (protected)
- `PATCH /api/applications/:id/status` - Update status via drag & drop (protected)

### AI
- `POST /api/ai/parse-job-description` - Parse job description with AI (protected)

## Application Statuses

- Applied
- Phone Screen
- Interview
- Offer
- Rejected

## Key Implementation Decisions

1. **AI Fallback Strategy**: When no API key is provided, the app uses local keyword extraction to parse job descriptions. This ensures the app remains functional even without an AI API key.

2. **JWT Authentication**: Token-based auth with localStorage persistence. The token is checked for validity on app initialization.

3. **React Query**: Used for data fetching with automatic caching, refetching, and optimistic updates.

4. **Drag & Drop**: Implemented with @dnd-kit for accessible drag and drop functionality.

5. **Error Handling**: Backend has comprehensive error middleware handling Mongoose errors, JWT errors, and custom API errors. Frontend displays user-friendly error messages.

## Assumptions & Tradeoffs

- The app assumes a single-user scenario per account
- AI parsing is best-effort; users should verify extracted data
- Resume suggestions are generated based on job description analysis
- No email verification required (simplified for demo)
- No password reset functionality (can be added later)

## Future Improvements

- Email notifications for application updates
- Interview scheduling integration
- Company research notes
- Application deadline tracking
- Analytics dashboard with charts
- Export to CSV/JSON
- Dark mode support
- Search and filter applications
- Multiple resume templates
- Integration with LinkedIn Easy Apply

## License

MIT