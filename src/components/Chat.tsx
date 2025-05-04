
import React, { useState, useEffect, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { Message, ChatSession } from "@/types/chat";
import { 
  createSession, 
  createRun, 
  fetchTeamConfig,
  TeamConfig 
} from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { processWebSocketMessage } from "@/services/messageProcessingService";

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
  const [teamConfig, setTeamConfig] = useState<TeamConfig | null>(null);
  const { toast } = useToast();

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const processedMessage = processWebSocketMessage(event);
    
    if (processedMessage) {
      // Remove any loading messages and add the new agent message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.status !== "loading");
        return [...withoutLoading, processedMessage];
      });
    }
  }, []);

  // Handle WebSocket errors
  const handleWebSocketError = useCallback((error: Event) => {
    console.error("WebSocket error:", error);
    toast({
      title: "Connection Error",
      description: "WebSocket connection error",
      variant: "destructive",
    });
  }, [toast]);

  // Initialize WebSocket connection
  const [wsState, sendMessageViaWebSocket] = useWebSocket({
    runId: chatSession.runId,
    teamConfig,
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError
  });

  // Update chat session with WebSocket state
  useEffect(() => {
    setChatSession(prev => ({
      ...prev,
      websocket: wsState.websocket,
      connected: wsState.connected
    }));
  }, [wsState]);

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        // Step 1: Create session
        const session = await createSession();
        
        // Step 2: Create run
        const run = await createRun(session.id);
        
        // Step 3: Fetch team configuration
        const teamId = 6; // Hardcoded team ID as per requirements
        const config = await fetchTeamConfig(teamId);
        
        setTeamConfig(config);
        
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
  }, [toast]); // Only run once on component mount

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

      // If team config is not available, we can't send the message
      if (!teamConfig) {
        throw new Error("Team configuration not available. Please refresh the page.");
      }

      // Send message via WebSocket
      const sent = sendMessageViaWebSocket(content);
      
      if (!sent) {
        throw new Error("Failed to send message. Please try again.");
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
