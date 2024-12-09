"use client";
import React, { useState, useRef, useEffect } from "react";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const defaultMessage = {
      role: "assistant",
      content: "BACKROOMS TERMINAL v1.0\nType 'help' for available commands",
    };
    setMessages([defaultMessage]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { message: input };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
  
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Unable to connect to the API." }]);
      console.error("Error connecting to the API:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-black text-[#00ff00] font-mono p-4 overflow-hidden">
      <pre className="text-[#00ff00] text-xs whitespace-pre font-mono mb-4">
        {`
        
 ____          _____ _  _______   ____   ____  __  __  _____            _____   _______ ______ _____  __  __ _____ _   _          _      
|  _ \\   /\\   / ____| |/ /  __ \\ / __ \\ / __ \\|  \\/  |/ ____|     /\\   |_   _| |__   __|  ____|  __ \\|  \\/  |_   _| \\ | |   /\\   | |     
| |_) | /  \\ | |    | ' /| |__) | |  | | |  | | \\  / | (___      /  \\    | |      | |  | |__  | |__) | \\  / | | | |  \\| |  /  \\  | |     
|  _ < / /\\ \\| |    |  < |  _  /| |  | | |  | | |\\/| |\\___ \\    / /\\ \\   | |      | |  |  __| |  _  /| |\\/| | | | | . \` | / /\\ \\ | |     
| |_) / ____ \\ |____| . \\| | \\ \\| |__| | |__| | |  | |____) |  / ____ \\ _| |_     | |  | |____| | \\ \\| |  | |_| |_| |\\  |/ ____ \\| |____ 
|____/_/    \\_\\_____|_|\\_\\_|  \\_\\\\____/ \\____/|_|  |_|_____/  /_/    \\_\\_____|    |_|  |______|_|  \\_\\_|  |_|_____|_| \\_/_/    \\_\\______| `}
      </pre>
      <div className="absolute top-0 left-0 w-full p-2 border-b border-[#00ff00] bg-black/90">
        <div className="flex justify-between items-center">
          <div className="text-xs">BACKROOMS-TERMINAL v1.0</div>
          <div className="text-xs matrix-time">SYSTEM-ACTIVE</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto mt-8 relative">
        <div className="matrix-bg absolute inset-0 opacity-10" />
        <div className="space-y-4 relative">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-2 rounded ${
                  msg.role === "user"
                    ? "text-[#00ff00] bg-[#003300]/30"
                    : "text-[#00cc00] bg-[#002200]/30"
                }`}
              >
                <div className="text-xs opacity-50 mb-1">
                  {msg.role === "user" ? "USER" : "SYSTEM"}
                </div>
                <span className="opacity-70">
                  {msg.role === "user" ? ">" : "$"}{" "}
                </span>
                <span className="typing-effect">{msg.content}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="text-[#00cc00] p-2 rounded bg-[#002200]/30">
                <div className="text-xs opacity-50 mb-1">SYSTEM</div>
                <span className="opacity-70">$ </span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-[#00ff00] pt-4 mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 bg-[#001100]/50 p-2 rounded"
        >
          <span className="text-[#00ff00] opacity-70">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#00ff00] font-mono"
            placeholder="Enter command..."
            name="message"
          />
        </form>
      </div>
    </div>
  );
}

export default MainComponent;