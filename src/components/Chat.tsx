
import React, { useState, useEffect, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { Message, ChatSession, WebSocketMessage } from "@/types/chat";
import { createSession, createRun, createWebSocket } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession>({
    sessionId: null,
    runId: null,
    userId: "guestuser@gmail.com",
    websocket: null,
    connected: false
  });
  const { toast } = useToast();

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        // Step 1: Create session
        const session = await createSession();
        
        // Step 2: Create run
        const run = await createRun(session.id);
        
        setChatSession(prev => ({
          ...prev,
          sessionId: session.id,
          runId: run.id
        }));

        // Add system message
        const systemMessage: Message = {
          role: "system",
          content: `Session created: ${session.name}`,
          timestamp: new Date(),
          status: "success",
        };
        
        setMessages(prev => [...prev, systemMessage]);
        toast({
          title: "Connected",
          description: `Session initialized successfully: ${session.name}`,
        });
      } catch (error) {
        console.error("Failed to initialize session:", error);
        const errorMessage: Message = {
          role: "system",
          content: `Failed to initialize session: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
          status: "error",
        };
        setMessages(prev => [...prev, errorMessage]);
        toast({
          title: "Connection Error",
          description: "Failed to initialize session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Cleanup function
    return () => {
      if (chatSession.websocket) {
        chatSession.websocket.close();
      }
    };
  }, [toast]); // Only run once on component mount

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      // Handle different message types
      if (data.type === "agent_message") {
        const agentMessage: Message = {
          role: "agent",
          content: data.content,
          timestamp: new Date(),
          status: "success",
        };
        setMessages(prev => [...prev, agentMessage]);
      } else if (data.type === "status") {
        // Handle status updates if needed
        console.log("Status update:", data);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }, []);

  // Set up WebSocket event handlers
  const setupWebSocket = useCallback((ws: WebSocket) => {
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setChatSession(prev => ({
        ...prev,
        websocket: ws,
        connected: true
      }));
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "WebSocket connection error",
        variant: "destructive",
      });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setChatSession(prev => ({
        ...prev,
        websocket: null,
        connected: false
      }));
    };
  }, [toast, handleWebSocketMessage]);

  // Send message via WebSocket
  const sendMessageViaWebSocket = (ws: WebSocket, content: string) => {
    const message: WebSocketMessage = {
      type: "user_message",
      content: content,
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(message));
  };

  const handleSendMessage = async (content: string) => {
    // Add user message to UI
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // If no runId, we can't establish a WebSocket connection
      if (!chatSession.runId) {
        throw new Error("No active session. Please refresh the page.");
      }

      // If WebSocket not connected yet, connect now
      if (!chatSession.websocket || !chatSession.connected) {
        const ws = createWebSocket(chatSession.runId);
        setupWebSocket(ws);
        
        // Wait for connection before sending
        ws.onopen = () => {
          setChatSession(prev => ({
            ...prev,
            websocket: ws,
            connected: true
          }));
          sendMessageViaWebSocket(ws, content);
        };
      } else {
        // WebSocket already connected, send message directly
        sendMessageViaWebSocket(chatSession.websocket, content);
      }
      
      // Add loading message
      const loadingMessage: Message = {
        role: "agent",
        content: "Processing your task...",
        timestamp: new Date(),
        status: "loading",
      };
      
      setMessages(prev => [...prev, loadingMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove any loading messages
      setMessages(prev => prev.filter(msg => msg.status !== "loading"));
      
      // Add error message
      const errorMessage: Message = {
        role: "agent",
        content: `Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
        timestamp: new Date(),
        status: "error",
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      <ChatHeader connected={chatSession.connected} />
      <div className="flex-1 overflow-hidden">
        <ChatContainer messages={messages} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
