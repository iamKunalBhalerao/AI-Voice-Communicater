import axios from "axios";

/**
 * Pre-configured Axios instance for backend API communication.
 * Automatically sends and receives cookies with cross-origin requests (`withCredentials: true`).
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
