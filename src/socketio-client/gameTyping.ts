import { io } from "socket.io-client";

const socketClientEndpoint: string = import.meta.env.VITE_API_URL || "http://localhost:3001"
export const socketClient = io(socketClientEndpoint);