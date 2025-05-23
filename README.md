# Assignment_Task-Splitter

## Overview

Assignment_Task-Splitter is a task distribution application designed to process a list of tasks provided via CSV upload. The tasks are parsed, validated, and evenly distributed among exactly five agents in the system. Any remaining tasks, after equal division, are assigned sequentially to the agents.

## Features

- CSV Upload: Accepts CSV files containing tasks with fields for `FirstName`, `Phone`, and optional `Notes`.
- Validation: Ensures data correctness, such as proper phone number format.
- Equal Distribution: Tasks are split evenly among five agents, regardless of total task count.
- Sequential Remainder Allocation: Any leftover tasks after equal distribution are assigned one-by-one to the agents.
- Agent-based Grouping: Tasks are grouped and displayed per agent.
- Real-time Updates: The frontend reflects the current distribution of tasks dynamically.
- Authentication: Supports user login and logout for secure access.

## CSV File Format

The uploaded CSV must include the following columns:

- FirstName: Text representing the name of the task owner.
- Phone: Numeric phone number (digits only, optional leading plus sign).
- Notes: Optional text notes related to the task.

## Example (as a table):

| FirstName | Phone       | Notes                  |
|-----------|-------------|------------------------|
| Alice     | 9876543210  | Follow-up on email     |
| Bob       | 8765432109  | Requested demo session |
| Charlie   | 7654321098  | Send brochure          |


## Commands - Running the Code

## for backend
```sh
cd Backend
```
```sh
npm install
```
```sh
npm run dev
```

## for frontend
```sh
cd Frontend
```
```sh
npm install
```
```sh
npm run dev
```

## How I Implemented It

1. **Project Structure**  
   - Created two root folders: `backend/` (Express API) and `frontend/` (Vite + React app).

2. **Backend Setup**  
   - Initialized an Express server and installed dependencies (Express, Mongoose, Multer, dotenv, bcryptjs, jsonwebtoken, csv-parse, xlsx).  
   - Connected to MongoDB Atlas via Mongoose (`connectDB()` in `config/db.js`).  
   - Configured middleware:
     - `express.json()` & `express.urlencoded()` for request parsing  
     - `cors()` with proper origins and credential support  
     - Static serving of `/uploads` directory  
   - Built **auth** functionality:
     - `register`, `signin`, `logout` controllers (bcrypt password hashing, JWT issuance).  
     - Protected routes with an `isAdmin` middleware to restrict certain endpoints.  
   - Implemented **agents** routes & controllers:
     - CRUD operations with JWT protection.  
   - Added **lists** upload endpoint:
     - Used Multer to accept CSV/XLS/XLSX files, validate MIME types and file size.  
     - Parsed and stored file metadata (optionally parsed CSV/XLSX rows with `csv-parse` / `xlsx`).  
   - Tested all endpoints thoroughly with Postman (token flow, error handling, edge cases).

3. **Frontend Setup**  
   - Bootstrapped with Vite + React + Tailwind CSS + Framer Motion.  
   - Configured `VITE_API_URL` env var for local (`http://localhost:5000`) and production API URLs.  
   - Implemented **Authentication**:
     - `Auth.jsx` for Register & Sign In views, form validation, loading states.  
     - Stored JWT in `localStorage` and set up `axios` defaults with `Authorization` header.  
   - Built **Dashboard**:
     - Protected route that fetches `/api/lists` distribution data.  
     - “Upload List” & “Logout” buttons wired to React Router.  
   - Created **Agent Management**:
     - `AgentManager.jsx` for listing, editing, deleting agents in real time via Socket / REST.  
   - Developed **File Upload**:
     - `Upload.jsx` & `SampleUploadBox.jsx` components for drag-and-click file selection, preview, and upload.  
   - Added **Task Distribution**:
     - `DistributedList.jsx` groups tasks by agent, displays Kanban-style columns, color-coded per agent.  

4. **Technical Highlights**  
   - **Security**: JWT with HttpOnly cookies / `Authorization` headers, role-based middleware.  
   - **Scalability**: Modular route/controller structure, environment-driven configuration.  
   - **UX**: Responsive Tailwind layouts, Framer Motion animations, toast notifications.  
   - **File Handling**: Multer for multipart/form-data, client & server MIME-type validation, CSV/XLSX parsing.  
   - **Testing & Deployment**:  
     - Local testing with Postman & React Dev Server.  
     - Frontend deployed on Vercel, backend on Render (or your chosen host).  


## Task Distribution Logic

- The total number of tasks is divided by five to determine the base number of tasks per agent.
- Remaining tasks (if total is not divisible by five) are assigned sequentially to the first agents until all tasks are distributed.
- Exactly five agents are selected from the database for distribution.
