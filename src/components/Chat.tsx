
import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import HayagrivaLogo from './HayagrivaLogo';
import { User } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from 'lucide-react';

interface ChatProps {
  messages: Array<{
    role: string;
    content: string;
  }>;
  onVoiceInput?: (text: string) => void;
  isFloating?: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, onVoiceInput, isFloating = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [latestAIMessage, setLatestAIMessage] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isFloating);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Get the latest AI message for voice reading
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    if (assistantMessages.length > 0) {
      const newest = assistantMessages[assistantMessages.length - 1];
      setLatestAIMessage(newest.content);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && onVoiceInput) {
      onVoiceInput(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderChatContent = () => {
    if (!isExpanded && isFloating) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <HayagrivaLogo className="w-10 h-10" />
          <p className="text-xs text-center mt-2">Click to chat</p>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className={cn(
          "flex flex-col items-center justify-center p-6 text-center",
          isFloating ? "h-60" : "h-80"
        )}>
          <HayagrivaLogo className="w-20 h-20 mb-6 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Start a conversation with Hayagriva</h3>
          <p className="text-muted-foreground max-w-md">
            Ask me anything about science, arts, engineering, or any subject. I'm here to assist with an Indian perspective.
          </p>
          <div className="mt-6">
            <VoiceAssistant onVoiceInput={onVoiceInput} alwaysShowVoiceButton={true} />
            <p className="text-xs text-muted-foreground mt-2">
              Click the microphone icon to start speaking
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={cn(
          "overflow-y-auto p-6",
          isFloating ? "h-60" : "h-80"
        )}>
          {messages.map((message, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-start gap-3 mb-6 animate-fade-in",
                message.role === 'assistant' ? "justify-start" : "justify-end flex-row-reverse"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Avatar className={cn(
                "h-8 w-8 border",
                message.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}>
                {message.role === 'assistant' ? (
                  <HayagrivaLogo className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Avatar>
              
              <div className={cn(
                "chat-message relative",
                message.role === 'assistant' ? "assistant-message" : "user-message"
              )}>
                {message.role === 'assistant' && <div className="message-indicator"></div>}
                <p className="text-sm">{message.content}</p>
                
                {message.role === 'assistant' && index === messages.length - 1 && (
                  <div className="mt-2">
                    <VoiceAssistant text={message.content} onVoiceInput={onVoiceInput} alwaysShowVoiceButton={true} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
          <VoiceAssistant onVoiceInput={onVoiceInput} iconOnly={true} alwaysShowVoiceButton={true} />
        </div>
      </>
    );
  };

  if (isFloating) {
    return (
      <div
        ref={chatContainerRef}
        className={cn(
          "fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg transition-all duration-300 overflow-hidden",
          isExpanded ? "w-80" : "w-16 h-16 cursor-pointer"
        )}
        onClick={isExpanded ? undefined : toggleExpanded}
      >
        {isExpanded && (
          <div className="flex justify-between items-center p-2 border-b">
            <h3 className="font-medium text-sm">Hayagriva Assistant</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={toggleExpanded}>
              &times;
            </Button>
          </div>
        )}
        {renderChatContent()}
      </div>
    );
  }

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      {renderChatContent()}
    </div>
  );
};

export default Chat;
