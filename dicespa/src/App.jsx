import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";

function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    const finalRoomId = roomId.trim() || generateRoomId();
    navigate(`/room/${finalRoomId}`, { state: { username } });
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Chatndice</h1>
      <input
        className="border p-2 rounded"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Enter room code (or leave blank to create)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleJoin}
        disabled={!username.trim()}
      >
        Join Room
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
} 
