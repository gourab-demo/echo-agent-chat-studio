
import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { Message } from "@/types/chat";
import { sendTask } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Add loading message from agent
    const loadingMessage: Message = {
      role: "agent",
      content: "Processing your task...",
      timestamp: new Date(),
      status: "loading",
    };
    
    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);
    
    try {
      const response = await sendTask(content);
      
      // Remove the loading message
      setMessages((prev) => prev.filter((msg) => msg.status !== "loading"));
      
      // Add the actual response
      const agentMessage: Message = {
        role: "agent",
        content: response.status 
          ? (response.data || response.message || "Task completed successfully") 
          : `Error: ${response.message}`,
        timestamp: new Date(),
        status: response.status ? "success" : "error",
      };
      
      setMessages((prev) => [...prev, agentMessage]);
      
      if (!response.status) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Remove the loading message
      setMessages((prev) => prev.filter((msg) => msg.status !== "loading"));
      
      // Add error message
      const errorMessage: Message = {
        role: "agent",
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : "An unknown error occurred",
        timestamp: new Date(),
        status: "error",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <ChatContainer messages={messages} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
