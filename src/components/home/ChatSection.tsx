
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Send } from "lucide-react";
import HayagrivaLogoHorseUpdate from '@/components/HayagrivaLogoHorseUpdate';
import Chat from '@/components/Chat';
import { generateChatbotCode } from '@/utils/codeGenerator';
import { useToast } from "@/components/ui/use-toast";

interface ChatSectionProps {
  messages: Array<{ role: string; content: string }>;
  onVoiceInput: (text: string) => void;
  handleDownloadChatbot: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, onVoiceInput, handleDownloadChatbot }) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (input.trim() === '') return;
    
    onVoiceInput(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section id="chat-section" className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Experience Hayagriva</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Start a conversation with Hayagriva and experience the future of AI assistance with an Indian perspective.
            </p>
          </div>
          
          {messages.length > 0 && (
            <Button 
              className="mt-4 md:mt-0 flex items-center gap-2" 
              variant="outline"
              onClick={handleDownloadChatbot}
            >
              <Download className="h-4 w-4" />
              Download Chatbot Code
            </Button>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card shadow-lg rounded-2xl border border-border overflow-hidden">
            <div className="p-3 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <HayagrivaLogoHorseUpdate className="w-6 h-6 mr-2" />
                <span className="font-medium">Hayagriva Assistant</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                  Voice Active
                </span>
              </div>
            </div>
            
            <Chat messages={messages} onVoiceInput={onVoiceInput} />
            
            <div className="p-4 border-t border-border flex items-center gap-2">                
              <Input
                placeholder="Ask Hayagriva something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              
              <Button onClick={handleSend} disabled={input.trim() === ''}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
