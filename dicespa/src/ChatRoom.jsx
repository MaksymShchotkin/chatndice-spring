// src/ChatRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20"];

export default function ChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const userName = location.state?.username || "Anonymous";

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [dice, setDice] = useState("d20");
  const [count, setCount] = useState(1);
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the room topic
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });

        // Send JOIN message
        stompClient.publish({
          destination: `/app/chat/${roomId}`,
          body: JSON.stringify({
            room: roomId,
            sender: userName,
            type: "JOIN",
            content: `${userName} has joined the room.`,
          }),
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClientRef.current?.deactivate();
    };
  }, [roomId, userName]);

  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    stompClientRef.current.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({
        room: roomId,
        sender: userName,
        type: "CHAT",
        content: messageInput,
      }),
    });
    setMessageInput("");
  };

  const rollDice = () => {
    stompClientRef.current.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({
        room: roomId,
        sender: userName,
        type: "DICE",
        diceType: dice,
        diceCount: parseInt(count, 10),
      }),
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Room: {roomId}</h2>
      <div style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div>
        <label>Dice Type: </label>
        <select value={dice} onChange={(e) => setDice(e.target.value)}>
          {diceTypes.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Amount: </label>
        <input
          type="number"
          min="1"
          max="10"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          style={{ width: "50px" }}
        />

        <button onClick={rollDice} style={{ marginLeft: "1rem" }}>
          Roll Dice
        </button>
      </div>
    </div>
  );
}
