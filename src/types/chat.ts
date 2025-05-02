
export interface Message {
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  status?: "success" | "error" | "loading";
}

export interface WebSocketMessage {
  type: "user_message" | "agent_message" | "status";
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  sessionId: number | null;
  runId: number | null;
  userId: string;
  websocket: WebSocket | null;
  connected: boolean;
}
