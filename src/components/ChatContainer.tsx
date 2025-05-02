
import React, { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import { Message } from "@/types/chat";

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-echo-light p-4 rounded-full mb-4">
          <MessageCircle className="h-8 w-8 text-echo-primary" />
        </div>
        <h3 className="text-xl font-medium text-gray-700">Welcome to Echo Agent Chat</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Send a task to the Echo Agent and get a response. Try asking it to solve a problem or
          analyze some data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto scrollbar-slim">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg.content}
          isUser={msg.role === "user"}
          timestamp={msg.timestamp}
          status={msg.status}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Import here to avoid circular dependency
import { MessageCircle } from "lucide-react";

export default ChatContainer;
