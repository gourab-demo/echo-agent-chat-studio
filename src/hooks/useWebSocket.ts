
import { useState, useEffect, useCallback } from "react";
import { TeamConfig } from "@/services/chatService";
import { WebSocketMessage } from "@/types/chat";

interface WebSocketHookProps {
  runId: number | null;
  teamConfig: TeamConfig | null;
  onMessage: (event: MessageEvent) => void;
  onError: (error: Event) => void;
}

interface WebSocketState {
  websocket: WebSocket | null;
  connected: boolean;
}

export const useWebSocket = ({ 
  runId, 
  teamConfig, 
  onMessage, 
  onError 
}: WebSocketHookProps): [WebSocketState, (content: string) => void] => {
  const [state, setState] = useState<WebSocketState>({
    websocket: null,
    connected: false
  });

  // Create and connect to WebSocket
  useEffect(() => {
    if (!runId) return;

    const wsUrl = `ws://127.0.0.1:8081/api/ws/runs/${runId}?token=null`;
    const ws = new WebSocket(wsUrl);

    // Configure WebSocket event handlers
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setState({
        websocket: ws,
        connected: true
      });

      // Send initial message as soon as the connection is established
      if (teamConfig) {
        const initialMessage: WebSocketMessage = {
          type: "start",
          task: "Hello",
          files: [],
          team_config: teamConfig.component
        };
        ws.send(JSON.stringify(initialMessage));
        console.log("Sent initial message to establish proper connection");
      }
    };

    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setState({
        websocket: null,
        connected: false
      });
    };

    // Cleanup function
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [runId, teamConfig, onMessage, onError]);

  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!state.websocket || !teamConfig) {
      console.error("WebSocket not connected or team config not available");
      return false;
    }

    const message: WebSocketMessage = {
      type: "start",
      task: content,
      files: [],
      team_config: teamConfig.component
    };
    
    console.log("Sending WebSocket message:", message);
    state.websocket.send(JSON.stringify(message));
    return true;
  }, [state.websocket, teamConfig]);

  return [state, sendMessage];
};
