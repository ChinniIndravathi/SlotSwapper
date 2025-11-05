SlotSwapper 

This archive contains a full SlotSwapper app (backend + frontend) without Docker. 
Frontend includes Login/Signup and Dashboard with Marketplace and Requests.

Run instructions:
1. Start MongoDB locally (mongod). Ensure it's accessible at mongodb://localhost:27017
2. Backend:
   cd backend
   npm install
   create .env with:
     MONGO_URI=mongodb://localhost:27017/slotswapper
     JWT_SECRET=mysupersecret
     PORT=4000
   npm start
3. Frontend:
   cd frontend
   npm install
   create .env with:
     VITE_API_BASE_URL=http://localhost:4000/api
   npm run dev

