
import React from "react";
import Chat from "@/components/Chat";

const Index = () => {
  return (
    <div className="min-h-screen bg-echo-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Echo Agent Chat Studio</h1>
          <p className="text-gray-600">
            Interact with your FastAPI-powered Echo Agent through this chat interface
          </p>
        </header>
        
        <div className="h-[calc(100vh-12rem)]">
          <Chat />
        </div>
        
        <footer className="mt-6 text-center text-sm text-gray-500">
          <p>
            Connect to your FastAPI backend at <code className="bg-gray-100 px-2 py-0.5 rounded">http://localhost:8000</code>
          </p>
          <p className="mt-1">
            Make sure to set the <code className="bg-gray-100 px-2 py-0.5 rounded">AUTOGENSTUDIO_TEAM_FILE</code> environment variable for the API
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
