
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a task to send",
        variant: "destructive",
      });
      return;
    }

    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="relative flex items-center">
        <Textarea
          className="min-h-[50px] max-h-[150px] pr-14 resize-none"
          placeholder="Type a task for the agent..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />
        <Button
          className="absolute right-1 bottom-1 h-8 w-8 p-0"
          type="submit"
          disabled={isLoading || !message.trim()}
          variant="ghost"
          size="icon"
        >
          <Send className="h-4 w-4 text-echo-primary" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInput;
