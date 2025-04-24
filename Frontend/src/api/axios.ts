// src/api/axios.ts (or wherever this file is)

import axios from "axios"; // Import from package, not the same file!

const instance = axios.create({
  baseURL: "http://localhost:8000", // Your FastAPI backend
});

export default instance;
