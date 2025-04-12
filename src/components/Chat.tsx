
import React, { useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import HayagrivaLogo from './HayagrivaLogo';
import { User } from 'lucide-react';

interface ChatProps {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center p-6 text-center">
        <HayagrivaLogo className="w-20 h-20 mb-6 opacity-50" />
        <h3 className="text-xl font-medium mb-2">Start a conversation with Hayagriva</h3>
        <p className="text-muted-foreground max-w-md">
          Ask me anything about science, arts, engineering, or any subject. I'm here to assist with an Indian perspective.
        </p>
      </div>
    );
  }

  return (
    <div className="h-80 overflow-y-auto p-6">
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
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
