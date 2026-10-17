# Interview-Ai 🎯🤖

An intelligent, AI-powered interview preparation and resume assessment platform built using the MERN stack and Google Gemini AI.

---

## 🚀 Features

- **AI Resume Parsing & Assessment**: Upload resumes (PDF) to automatically extract candidate details, skills, experience, and receive AI-driven candidate evaluation.
- **AI-Powered Technical Assessment**: Generate tailored interview recommendations, strength analyses, and identify growth areas based on job requirements.
- **Secure Authentication**: Complete JWT-based authentication system with secure cookie handling, password hashing, and protected routes.
- **Modern Responsive UI**: Built with React, Vite, SCSS, and Lucide React icons for a responsive user experience.
- **Clean Architecture**: Decoupled Express.js backend with controllers, services, middleware, and MongoDB schemas.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **React Router** for client-side navigation
- **SCSS** for styling
- **Axios** for API requests
- **Lucide React** for modern iconography

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **Google GenAI SDK** (Gemini AI)
- **JSON Web Tokens (JWT)** & **bcryptjs**
- **Multer** & **pdf-parse** for file uploads and resume parsing

---

## 📁 Project Structure

```text
Interview-Ai/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Authentication & Interview controllers
│   │   ├── middlewares/     # Auth and file upload middlewares
│   │   ├── models/          # Mongoose models (User, InterviewReport, Blacklist)
│   │   ├── routes/          # Express route definitions
│   │   └── services/        # AI service (Gemini integration)
│   ├── .env.example         # Environment variable template
│   ├── server.js            # Express application entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── features/        # Auth and Interview feature modules
│   │   ├── styles/          # Global and component styles (SCSS)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance
- [Google AI Studio](https://aistudio.google.com/) Gemini API Key

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Parampandya0332/Interview-Ai.git
cd Interview-Ai
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory (refer to `.env.example`):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GOOGLE_GENAI_MODEL=gemini-1.5-flash
```

Start the backend server:
```bash
npm run dev
# or: node server.js
```

The backend server runs on `http://localhost:3000`.

#### 3. Frontend Setup
In a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```

The frontend application runs on `http://localhost:5173`.

---

## 🔒 Security & Environment Variables

- Sensitive credentials (`.env`) are strictly ignored by `.gitignore` and should never be committed to source control.
- Use `.env.example` to configure your environment variables safely.

---

## 📄 License

This project is licensed under the ISC License.
