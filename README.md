<div align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  
  <br />
  <br />
  
  <h1>Taskor</h1>
  <p><strong>Organize the chaos.</strong></p>
  <p>A full-stack task management application with drag-and-drop, due dates, and calendar view.</p>
  
  <br />
  
  
  <a href="#-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#api-documentation">API Documentation</a> •
  <a href="#live-demo">Live Demo (soon)</a> 
  
  <br />
  <br />
  
  <!-- <img src="https://via.placeholder.com/800x400/FAF4E3/131214?text=Taskor+Screenshot" alt="Taskor Screenshot" width="80%" /> -->
</div>

---

## 📖 About

**Taskor** is a full-stack task management application built with the MERN stack. It features an intuitive drag-and-drop interface, powerful search and filtering, due date tracking, and a calendar view. All wrapped in a neobrutalism-inspired design.



---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| **Authentication** | Secure JWT-based user authentication with bcrypt password hashing |
| **Drag & Drop** | Intuitive drag-and-drop interface using dnd-kit |
| **Due Dates** | Set due dates with color-coded badges (today, tomorrow, overdue) |
| **Search & Filter** | Real-time search with priority, status, and due date filters |
| **Calendar View** | Monthly calendar with task counts and day details |
| **Analytics Dashboard** | Visual insights with charts for status, priority, and completion trends |
| **Tags/Labels** | Categorize tasks with custom colored tags |
| **Stats Dashboard** | Quick overview of task statistics |
| **Keyboard Shortcuts** | Power user shortcuts for faster task management |
| **Neobrutalism Design** | bold, raw aesthetic with custom color palette |

### 🎨 Design Philosophy
- **Neobrutalism-inspired** - Bold borders, black shadows
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - Keyboard shortcuts for power users
- **Unique Color Palette** - Custom colors that stand out from typical SaaS apps



### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `n` | Open quick add task |  
| `⌘F` / `Ctrl+F` | Focus search |  
| `⌘C` / `Ctrl+C` | Open Calendar |  
| `a`  | Open Analytics |  
| `ESC` | Close modal / Clear search | 

---

## Features in Progress

| Feature | Status | Priority |
|---------|--------|----------|
| Dark Mode | Planning | High |
| Export/Import Tasks | Planning | Medium |
| Email Notifications | Planning | Medium |
| Task Comments | Planning | Medium |
| File Attachments | Planning | Low |

## Tech Stack

### Frontend
```
├── React 18
├── Vite
├── Tailwind CSS
├── dnd-kit (Drag & Drop)
├── React Router DOM
├── React Hot Toast
└── Fetch API
```

### Backend
```
├── Node.js
├── Express.js
├── MongoDB
├── Mongoose
├── JWT (Authentication)
├── bcryptjs (Password hashing)
└── CORS
```

### Development Tools
```
├── ESLint
├── Prettier
├── Git
└── GitHub Actions (coming soon)
```

### 📁 Project Structure
```
taskor/
├── backend/
│   ├── config/          # Database connection
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # JWT authentication
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Auth context
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Main app
│   └── index.html
└── README.md
```

## API Documentation

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |


### Task Routes

| Method   | Endpoint              | Description           | Auth Required |
| -------- | --------------------- | --------------------- | ------------- |
| `GET`    | `/api/tasks`          | Get all tasks         | ✅             |
| `POST`   | `/api/tasks`          | Create task           | ✅             |
| `PUT`    | `/api/tasks/:id`      | Update task           | ✅             |
| `DELETE` | `/api/tasks/:id`      | Delete task           | ✅             |
| `PUT`    | `/api/tasks/position` | Update task positions | ✅             |


## Running Locally

### 1. Clone it
```bash
git clone https://github.com/chaima-sahli/Task-Manager.git
```

### 2. Install dependencies (both backend & frontend)
```bash
cd Task-Manager/backend && npm install
cd ../frontend && npm install
```

### 3. Add your MongoDB connection in `.env`

### 4. Start both servers

**Terminal 1 - Backend**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend && npm run dev
```


## ✦ Author ✦

**Chaima Sahli**

- GitHub: [@chaima-sahli](https://github.com/chaima-sahli)
- LinkedIn: [chaima-sahli](https://linkedin.com/in/chaima-sahli)




##  Live Demo
**soon**


<div align="center">
  <pre>
    ═══════════════════════════════════════════════════
    ████████╗ █████╗ ███████╗██╗  ██╗ ██████╗ ██████╗ 
    ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔═══██╗██╔══██╗
       ██║   ███████║███████╗█████╔╝ ██║   ██║███████║
       ██║   ██╔══██║╚════██║██╔═██╗ ██║   ██║██╔══██╗
       ██║   ██║  ██║███████║██║  ██╗╚██████╔╝██║  ██║
       ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
    ═══════════════════════════════════════════════════
         Organize the chaos.
    ═══════════════════════════════════════════════════
  </pre>
</div>