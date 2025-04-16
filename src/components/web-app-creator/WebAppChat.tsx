
import React, { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import { useWebAppGenerator } from './WebAppGeneratorContext';

interface WebAppChatProps {
  onChatMessage: (message: string) => void;
}

const WebAppChat: React.FC<WebAppChatProps> = ({ onChatMessage }) => {
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

  return <Chat messages={messages} onVoiceInput={handleVoiceInput} />;
};

export default WebAppChat;
