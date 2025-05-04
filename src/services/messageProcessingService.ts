
import { Message } from "@/types/chat";

// Process WebSocket messages and convert them to UI messages
export const processWebSocketMessage = (event: MessageEvent): Message | null => {
  try {
    const data = JSON.parse(event.data);
    console.log("WebSocket message received:", data);
    
    // Handle the result format
    if (data.type === "result" && data.data && data.data.task_result) {
      const resultMessages = data.data.task_result.messages;
      
      if (Array.isArray(resultMessages) && resultMessages.length > 0) {
        // Find the assistant message(s)
        const assistantMessages = resultMessages.filter(
          msg => msg.source === "assistant_agent" && msg.content
        );
        
        if (assistantMessages.length > 0) {
          // Get the latest assistant message
          const latestAssistantMsg = assistantMessages[assistantMessages.length - 1];
          
          // Clean up the content (remove TERMINATE if present)
          let cleanContent = latestAssistantMsg.content;
          if (typeof cleanContent === 'string') {
            cleanContent = cleanContent.replace(/\s*\n*TERMINATE\.\s*$/, '').trim();
          }
          
          return {
            role: "agent",
            content: cleanContent,
            timestamp: new Date(),
            status: "success",
          };
        }
      }
    } else if (data.type === "agent_message") {
      // Handle legacy format for backward compatibility
      return {
        role: "agent",
        content: data.content,
        timestamp: new Date(),
        status: "success",
      };
    } else if (data.type === "status") {
      // Handle status updates if needed
      console.log("Status update:", data);
    }
    
    return null;
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
    return null;
  }
};
