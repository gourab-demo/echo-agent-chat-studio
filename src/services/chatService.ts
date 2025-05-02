
// Service to interact with our FastAPI backend

export interface ApiResponse {
  message: string;
  status: boolean;
  data: string | null;
}

const API_URL = 'http://localhost:8000'; // Change this to match your FastAPI server URL

export const sendTask = async (task: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/predict/${encodeURIComponent(task)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending task:', error);
    return {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: false,
      data: null
    };
  }
};
