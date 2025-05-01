
import React, { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import { useWebAppGenerator } from './WebAppGeneratorContext';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface WebAppChatProps {
  onChatMessage: (message: string) => void;
  generating?: boolean;
}

const WebAppChat: React.FC<WebAppChatProps> = ({ onChatMessage, generating }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      { 
        role: "assistant", 
        content: "Welcome to the Hayagriva Web App Creator! Just tell me what kind of web app you want to build, and I'll generate it for you. Be as descriptive as possible for better results." 
      }
    ]);
  }, []);

  // Add generating status message
  useEffect(() => {
    if (generating) {
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I'm now generating your web application based on your description. You'll see real-time updates on the progress above." 
        }
      ]);
    }
  }, [generating]);

  const handleVoiceInput = (text: string) => {
    setMessages(prev => [...prev, { role: "user", content: text }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I'll help you create a web app based on: "${text}". Click the "Generate App" button when you're ready!`
      }]);
    }, 800);
    
    onChatMessage(text);
  };

  if (generating) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Chat messages={messages} onVoiceInput={handleVoiceInput} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">AI Assistant</h3>
      <Chat messages={messages} onVoiceInput={handleVoiceInput} />
    </Card>
  );
};

export default WebAppChat;
