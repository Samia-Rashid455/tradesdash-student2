Frontend: cd frontend, npm install, npm run dev (uses sample data by default)
Backend:  cd backend, npm install, add MONGODB_URI to backend/.env (see .env.example), npm run dev
To use the real backend: add VITE_USE_MOCK=false to frontend/.env and restart the frontend