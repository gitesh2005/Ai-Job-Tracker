# AI Job Tracker - Frontend

A React-based frontend for tracking job applications with AI-powered features.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Query
- Axios
- @dnd-kit (Drag & Drop)

## Getting Started

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- User authentication (login/register)
- Kanban board for job applications
- Drag and drop between status columns
- Add/Edit/Delete applications
- AI-powered job description parsing
- Resume suggestions
- Responsive design
