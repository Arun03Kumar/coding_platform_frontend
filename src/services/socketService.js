import { io } from "socket.io-client";
import { setRunOutput } from "@/store/runOutputSlice";

let socket = null;

export const initializeSocket = (dispatch) => {
  if (!socket) {
    socket = io("https://leetcode-socket-service-d7451d005125.herokuapp.com/");
    // socket = io("http://localhost:3005");

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("setUserId", "anonymous");
    });

    socket.on("submissionPayloadResponse", (data) => {
      console.log("Received run output:", data);
      dispatch(setRunOutput(data));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
