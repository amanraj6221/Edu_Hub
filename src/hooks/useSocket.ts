// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(onMessage: (payload: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socket = io(url, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("portfolio_update", (payload: any) => {
      console.log("portfolio_update received", payload);
      if (onMessage) onMessage(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}
