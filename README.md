# Sahyog - Collegiate Skill Synergy & Team Assembler

Sahyog is a web application designed for university students to find peer matches for skill sharing and assemble squads for hackathons. It features a client-side synergy matching score, dynamic searches, real-time messaging, and team application flows.

---

## Prerequisites

Before setting up the project, make sure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** (running locally or via MongoDB Atlas)

---

## Getting Started

Follow these step-by-step instructions to get a local copy up and running.

### 1. Clone the Repository

Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd Sahyog
```

---

### 2. Backend Setup

The backend is built using Node.js, Express, and MongoDB.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a file named `.env` in the `server` directory and add the following:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/sahyog
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   ```
   *Note: Ensure your MongoDB server is running on the URI specified in `MONGO_URI`.*

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

The frontend is built using React, Vite, and Tailwind CSS.

1. In a new terminal tab/window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## Project Structure

```
Sahyog/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── api/          # Axios instance and API integration routes
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Authentication context
│   │   ├── hooks/        # Custom React hooks (matches, teams, etc.)
│   │   └── pages/        # Router pages (Dashboard, Profiles, Matches, Chat)
│   ├── index.html
│   └── vite.config.js    # Vite configuration with backend API proxying
│
└── server/               # Express backend application
    ├── config/           # Database configuration
    ├── controllers/      # Route controllers (Auth, Users, Teams, Messages)
    ├── models/           # Mongoose schemas (User, Team, Message)
    ├── routes/           # REST endpoints mapping
    ├── socket/           # Real-time socket handlers (messaging)
    └── index.js          # Server entrypoint
```

## Features Implemented

- **Skill Synergy Matrix**: Finds peers matching mutual learn-teach skills.
- **Hackathon Team Finder**: Browse active hackathon squads, submit pitches/join applications, and manage recruitment.
- **Real-Time Messaging**: Chat live with connections and team members (Socket.io).
- **Interactive Connections**: Request connection, accept/reject, or remove campus connections directly from the UI.
