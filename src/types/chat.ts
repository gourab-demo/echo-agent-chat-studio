
export interface Message {
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  status?: "success" | "error" | "loading";
}

export interface WebSocketMessage {
  type: "user_message" | "agent_message" | "status" | "result" | "start";
  content?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  data?: {
    task_result?: {
      messages?: Array<{
        source: string;
        content: string;
        type: string;
        models_usage?: Record<string, any>;
        metadata?: Record<string, any>;
      }>;
      stop_reason?: string;
    };
    usage?: string;
    duration?: number;
  };
  status?: string;
  task?: string;
  files?: any[];
  team_config?: any;
}

export interface ChatSession {
  sessionId: number | null;
  runId: number | null;
  userId: string;
  websocket: WebSocket | null;
  connected: boolean;
}
