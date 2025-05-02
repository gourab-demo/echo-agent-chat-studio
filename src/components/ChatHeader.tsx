
import React from "react";

interface ChatHeaderProps {
  connected?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ connected = false }) => {
  return (
    <div className="border-b border-gray-200 p-4 bg-white rounded-t-lg flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="font-semibold text-lg">Echo Agent</h2>
        <div className="flex items-center ml-3">
          <div className={`h-2 w-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-500">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <span>WebSocket Chat</span>
      </div>
    </div>
  );
};

export default ChatHeader;
