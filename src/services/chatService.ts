
import { Message } from "@/types/chat";

export interface ApiResponse {
  status: boolean;
  data: any;
  message?: string;
}

export interface Session {
  id: number;
  name: string;
  user_id: string;
  team_id: number;
  created_at: string;
  updated_at: string;
  version: string;
}

export interface Run {
  id: number;
  session_id: number;
  user_id: string;
}

export interface TeamConfig {
  created_at: string;
  user_id: string;
  version: string;
  updated_at: string;
  id: number;
  component: {
    provider: string;
    component_type: string;
    version: number;
    component_version: number;
    description: string;
    label: string;
    config: any;
  };
}

const API_URL = 'http://127.0.0.1:8081/api'; // Backend API URL

// Create a new session
export const createSession = async (userId: string = "guestuser@gmail.com"): Promise<Session> => {
  try {
    const response = await fetch(`${API_URL}/sessions/?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.status || !data.data || !data.data[0]) {
      throw new Error('Failed to create session');
    }
    
    return data.data[0] as Session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Create a new run
export const createRun = async (sessionId: number, userId: string = "guestuser@gmail.com"): Promise<Run> => {
  try {
    const response = await fetch(`${API_URL}/runs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.status || !data.data) {
      throw new Error('Failed to create run');
    }
    
    return data.data as Run;
  } catch (error) {
    console.error('Error creating run:', error);
    throw error;
  }
};

// Fetch team configuration
export const fetchTeamConfig = async (teamId: number, userId: string = "guestuser@gmail.com"): Promise<TeamConfig> => {
  try {
    const response = await fetch(`${API_URL}/teams/${teamId}?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data) {
      throw new Error('Failed to fetch team configuration');
    }
    
    return data as TeamConfig;
  } catch (error) {
    console.error('Error fetching team configuration:', error);
    throw error;
  }
};

// Create WebSocket connection
export const createWebSocket = (runId: number): WebSocket => {
  const wsUrl = `ws://127.0.0.1:8081/api/ws/runs/${runId}?token=null`;
  return new WebSocket(wsUrl);
};

// Format the message to send via WebSocket
export const formatWebSocketMessage = (task: string, teamComponent: any) => {
  return {
    type: "start",
    task: task,
    files: [],
    team_config: teamComponent
  };
};

// Legacy method - no longer used but kept for backward compatibility
export const sendTask = async (task: string): Promise<ApiResponse> => {
  console.warn('sendTask is deprecated, use WebSocket connection instead');
  return {
    status: false,
    message: 'Method deprecated, use WebSocket connection instead',
    data: null
  };
};
