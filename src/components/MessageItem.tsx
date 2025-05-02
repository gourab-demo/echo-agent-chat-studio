
import React from "react";
import { User } from "lucide-react";

interface MessageItemProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  status?: "success" | "error" | "loading";
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser, timestamp, status }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-echo-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-echo-secondary flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div>
          <div 
            className={`rounded-2xl px-4 py-2 ${
              isUser 
                ? "bg-echo-message-user text-white rounded-tr-none" 
                : "bg-echo-message-agent text-gray-800 rounded-tl-none"
            }`}
          >
            <p className="whitespace-pre-line">{message}</p>
            {status === "loading" && (
              <div className="flex space-x-1 mt-1 h-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            )}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
            {formattedTime}
            {status === "success" && <span className="ml-2 text-echo-success">✓</span>}
            {status === "error" && <span className="ml-2 text-echo-error">✕</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the MessageCircle here to avoid circular dependency
import { MessageCircle } from "lucide-react";

export default MessageItem;
