# AI Job Tracker 🚀

An AI-powered full-stack MERN application to track and manage job applications using a Kanban board, with intelligent job description parsing and resume suggestions.

---

## 🌐 Live Demo

Frontend: https://ai-job-tracker-frontend.netlify.app
Backend: https://ai-job-tracker-0ivm.onrender.com

---

## ✨ Features

* 🔐 Secure authentication using JWT
* 📊 Kanban board (Applied → Phone Screen → Interview → Offer → Rejected)
* 🖱️ Drag & Drop application cards
* 🤖 AI-powered job description parser
* 🧠 Resume bullet suggestions tailored to each job
* 📝 Full CRUD for job applications
* 📱 Responsive UI (mobile + desktop)

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt password hashing

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Query (TanStack Query)
* React Router DOM
* @dnd-kit (Drag & Drop)
* Axios

---

## 📁 Project Structure

```
ai-job-tracker/
├── backend/
│   ├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── utils/
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
OLLAMA_API_KEY=your_ollama_key
OLLAMA_BASE_URL=https://api.ollama.ai
OLLAMA_MODEL=llama3.2
CLIENT_URL=http://localhost:5173
```

---

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ▶️ Running Locally

### 1. Clone repo

```
git clone https://github.com/gitesh2005/Ai-Job-Tracker.git
cd Ai-Job-Tracker
```

---

### 2. Backend setup

```
cd backend
npm install
cp .env.example .env
npm run dev
```

---

### 3. Frontend setup

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔗 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`

### Applications

* GET `/api/applications`
* POST `/api/applications`
* PATCH `/api/applications/:id`
* DELETE `/api/applications/:id`
* PATCH `/api/applications/:id/status`

### AI

* POST `/api/ai/parse-job-description`

---

## 🧠 Key Implementation Decisions

* AI parsing implemented in a service layer (not controllers)
* Fallback logic when AI API key is missing
* JWT stored client-side with validation on load
* React Query used for API state management
* Clean modular backend structure (auth, applications, AI)

---

## ⚖️ Assumptions & Trade-offs

* No email verification (simplified flow)
* AI parsing is best-effort (user can edit)
* No password reset (can be added later)
* Single-user account model

---

## 🚀 Deployment

* Frontend → Netlify
* Backend → Render
* Database → MongoDB Atlas

---

## 🔒 Security Features

* Password hashing using bcrypt
* JWT authentication
* Input validation
* Rate limiting
* Helmet security headers
* CORS protection

---

## 🔮 Future Improvements

* Email notifications
* Dashboard analytics
* Search & filters
* Resume export
* Dark mode
* Notifications & reminders

---

## 📌 How This Project Stands Out

* Combines AI + full-stack development
* Clean architecture with TypeScript
* Real-world problem solving
* Deployable production-ready app

---

## 📄 License

MIT License

---

## 🙌 Author

Gitesh
B.Tech Student | Full Stack Developer | Aspiring AI Engineer
