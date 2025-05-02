
import React from "react";
import { MessageCircle } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="bg-echo-secondary p-2 rounded-full">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Echo Agent Chat Studio</h1>
          <p className="text-sm text-gray-500">Ask the agent to complete tasks</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
          Online
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
