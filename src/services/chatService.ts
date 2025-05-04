
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

const API_URL = 'http://localhost:8081/api'; // Backend API URL

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

// Create WebSocket connection
export const createWebSocket = (runId: number): WebSocket => {
  const wsUrl = `ws://localhost:8081/api/ws/runs/${runId}?token=null`;
  return new WebSocket(wsUrl);
};

// Format the message to send via WebSocket
export const formatWebSocketMessage = (task: string) => {
  return {
    type: "start",
    task: task,
    files: [],
    team_config: {
      provider: "autogen_agentchat.teams.SelectorGroupChat",
      component_type: "team",
      version: 1,
      component_version: 1,
      description: "A team with 2 agents - an AssistantAgent (with a calculator tool) and a CriticAgent in a SelectorGroupChat team.",
      label: "Selector Team_17463",
      config: {
        participants: [
          {
            provider: "autogen_agentchat.agents.AssistantAgent",
            component_type: "agent",
            version: 1,
            component_version: 1,
            description: "An agent that provides assistance with tool use.",
            label: "AssistantAgent",
            config: {
              name: "assistant_agent",
              model_client: {
                provider: "autogen_ext.models.openai.AzureOpenAIChatCompletionClient",
                component_type: "model",
                version: 1,
                component_version: 1,
                description: "GPT-4o Mini Azure OpenAI model client.",
                label: "AzureOpenAI GPT-4o-mini",
                config: {
                  model: "gpt-4o-mini",
                  api_key: "5viPcZ9EJEwVIiTURowm6yMdUdQVq2QBhVGT0WFMlJ0M2D7bXrzYJQQJ99BDACYeBjFXJ3w3AAABACOGLjHz",
                  azure_endpoint: "https://newaiplatform.openai.azure.com/",
                  azure_deployment: "aiplatform",
                  api_version: "2025-01-01-preview"
                }
              },
              tools: [
                {
                  provider: "autogen_core.tools.FunctionTool",
                  component_type: "tool",
                  version: 1,
                  component_version: 1,
                  description: "Create custom tools by wrapping standard Python functions.",
                  label: "FunctionTool",
                  config: {
                    source_code: "def calculator(a: float, b: float, operator: str) -> str:\n    try:\n        if operator == \"+\":\n            return str(a + b)\n        elif operator == \"-\":\n            return str(a - b)\n        elif operator == \"*\":\n            return str(a * b)\n        elif operator == \"/\":\n            if b == 0:\n                return \"Error: Division by zero\"\n            return str(a / b)\n        else:\n            return \"Error: Invalid operator. Please use +, -, *, or /\"\n    except Exception as e:\n        return f\"Error: {str(e)}\"\n",
                    name: "calculator",
                    description: "A simple calculator that performs basic arithmetic operations",
                    global_imports: [],
                    has_cancellation_support: false
                  }
                }
              ],
              handoffs: [],
              model_context: {
                provider: "autogen_core.model_context.UnboundedChatCompletionContext",
                component_type: "chat_completion_context",
                version: 1,
                component_version: 1,
                description: "An unbounded chat completion context that keeps a view of the all the messages.",
                label: "UnboundedChatCompletionContext",
                config: {}
              },
              description: "An agent that provides assistance with ability to use tools.",
              system_message: "You are a helpful assistant. Solve tasks carefully. When done, say TERMINATE.",
              model_client_stream: false,
              reflect_on_tool_use: false,
              tool_call_summary_format: "{result}"
            }
          },
          {
            provider: "autogen_agentchat.agents.AssistantAgent",
            component_type: "agent",
            version: 1,
            component_version: 1,
            description: "An agent that provides assistance with tool use.",
            label: "AssistantAgent",
            config: {
              name: "critic_agent",
              model_client: {
                provider: "autogen_ext.models.openai.AzureOpenAIChatCompletionClient",
                component_type: "model",
                version: 1,
                component_version: 1,
                description: "GPT-4o Mini Azure OpenAI model client.",
                label: "AzureOpenAI GPT-4o-mini",
                config: {
                  model: "gpt-4o-mini",
                  api_key: "5viPcZ9EJEwVIiTURowm6yMdUdQVq2QBhVGT0WFMlJ0M2D7bXrzYJQQJ99BDACYeBjFXJ3w3AAABACOGLjHz",
                  azure_endpoint: "https://newaiplatform.openai.azure.com/",
                  azure_deployment: "aiplatform",
                  api_version: "2025-01-01-preview"
                }
              },
              tools: [],
              handoffs: [],
              model_context: {
                provider: "autogen_core.model_context.UnboundedChatCompletionContext",
                component_type: "chat_completion_context",
                version: 1,
                component_version: 1,
                description: "An unbounded chat completion context that keeps a view of the all the messages.",
                label: "UnboundedChatCompletionContext",
                config: {}
              },
              description: "an agent that critiques and improves the assistant's output",
              system_message: "You are a helpful assistant. Critique the assistant's output and suggest improvements.",
              model_client_stream: false,
              reflect_on_tool_use: false,
              tool_call_summary_format: "{result}"
            }
          }
        ],
        model_client: {
          provider: "autogen_ext.models.openai.AzureOpenAIChatCompletionClient",
          component_type: "model",
          version: 1,
          component_version: 1,
          description: "GPT-4o Mini Azure OpenAI model client.",
          label: "AzureOpenAI GPT-4o-mini",
          config: {
            model: "gpt-4o-mini",
            api_key: "5viPcZ9EJEwVIiTURowm6yMdUdQVq2QBhVGT0WFMlJ0M2D7bXrzYJQQJ99BDACYeBjFXJ3w3AAABACOGLjHz",
            azure_endpoint: "https://newaiplatform.openai.azure.com/",
            azure_deployment: "aiplatform",
            api_version: "2025-01-01-preview"
          }
        },
        termination_condition: {
          provider: "autogen_agentchat.base.OrTerminationCondition",
          component_type: "termination",
          version: 1,
          component_version: 1,
          label: "OrTerminationCondition",
          config: {
            conditions: [
              {
                provider: "autogen_agentchat.conditions.TextMentionTermination",
                component_type: "termination",
                version: 1,
                component_version: 1,
                description: "Terminate the conversation if a specific text is mentioned.",
                label: "TextMentionTermination",
                config: {
                  text: "TERMINATE"
                }
              },
              {
                provider: "autogen_agentchat.conditions.MaxMessageTermination",
                component_type: "termination",
                version: 1,
                component_version: 1,
                description: "Terminate the conversation after a maximum number of messages have been exchanged.",
                label: "MaxMessageTermination",
                config: {
                  max_messages: 10,
                  include_agent_event: false
                }
              }
            ]
          }
        },
        selector_prompt: "You are in a role play game. The following roles are available:\n{roles}.\nRead the following conversation. Then select the next role from {participants} to play. Only return the role.\n\n{history}\n\nRead the above conversation. Then select the next role from {participants} to play. Only return the role.\n",
        allow_repeated_speaker: false,
        max_selector_attempts: 3
      }
    }
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
