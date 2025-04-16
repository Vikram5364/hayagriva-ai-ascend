
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { generateChatbotCode } from '@/utils/codeGenerator';

// Import refactored components
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ChatSection from '@/components/home/ChatSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();

  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [showChat, setShowChat] = useState(false);
  
  // Parse the URL parameters to check if we should show a specific chatbot
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatbotParam = params.get('chatbot');
    
    if (chatbotParam) {
      setShowChat(true);
      // Scroll to chat section after a small delay to ensure elements are rendered
      setTimeout(() => {
        document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
        
        // Add an initial message based on the chatbot
        const initialMessage = {
          role: 'user',
          content: `I'd like to learn about ${chatbotParam}`
        };
        
        setMessages([initialMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          let aiResponse = `I'd be happy to teach you about ${chatbotParam}. What specific aspects would you like to explore?`;
          
          setMessages([
            initialMessage,
            { role: 'assistant', content: aiResponse }
          ]);
        }, 1000);
      }, 100);
    }
  }, [location.search]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleVoiceInput = (text: string) => {
    if (text.trim()) {
      // Add user message
      const newMessages = [
        ...messages,
        { role: 'user', content: text },
      ];
      
      setMessages(newMessages);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = "Namaste! I am Hayagriva, your AI assistant with an Indian accent. I'm here to help you with your questions and tasks. How can I assist you today?";
        
        setMessages([
          ...newMessages,
          { role: 'assistant', content: aiResponse }
        ]);
      }, 1000);
    }
  };

  const scrollToChat = () => {
    setShowChat(true);
    setTimeout(() => {
      document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDownloadChatbot = () => {
    try {
      const code = generateChatbotCode(messages);
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'hayagriva-chatbot.js';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Chatbot code downloaded successfully",
        description: "You can now integrate the Hayagriva chatbot into your own projects!",
      });
    } catch (error) {
      console.error('Failed to download code:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was a problem generating the chatbot code. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Sun className="h-5 w-5 text-muted-foreground" />
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
        />
        <Moon className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Main Content */}
      <HeroSection scrollToChat={scrollToChat} />
      <FeaturesSection />
      <ChatSection 
        messages={messages} 
        onVoiceInput={handleVoiceInput} 
        handleDownloadChatbot={handleDownloadChatbot} 
      />
      <Footer />
    </div>
  );
};

export default Index;
