
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Send, 
  ArrowDown 
} from 'lucide-react';
import HayagrivaLogoHorse from '@/components/HayagrivaLogoHorse';
import Chat from '@/components/Chat';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/data/features';
import { useTheme } from '@/components/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [speakResponse, setSpeakResponse] = useState(true);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const speakText = (text: string) => {
    if (!speakResponse) return;
    
    const synth = window.speechSynthesis;
    synth.cancel(); // Stop any current speaking
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get all available voices
    const voices = synth.getVoices();
    
    // Try to find an Indian English voice
    const indianVoice = voices.find(voice => 
      (voice.lang.includes('en-IN') || 
       voice.name.includes('Indian') || 
       voice.name.includes('Hindi'))
    );
    
    // Use a male voice preferably with Indian accent, or fallback to any English voice
    if (indianVoice) {
      utterance.voice = indianVoice;
    } else {
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Male')
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    
    // Adjust parameters to simulate Indian accent if needed
    utterance.rate = 0.9; // Slightly slower
    utterance.pitch = 1.1; // Slightly higher pitch
    
    synth.speak(utterance);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const newMessages = [
      ...messages,
      { role: 'user', content: input },
    ];
    
    setMessages(newMessages);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = "Namaste! I am Hayagriva, your AI assistant with an Indian accent. I'm here to help you with your questions and tasks. How can I assist you today?";
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: aiResponse }
      ]);
      
      // Automatically speak the AI's response
      speakText(aiResponse);
      
      // Notify user if this is the first message
      if (newMessages.length === 1) {
        toast({
          title: "Voice Output Active",
          description: "Hayagriva is now speaking. The voice output is automatic."
        });
      }
    }, 1000);
  };

  // Initialize speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Initialize voices
    const populateVoices = () => {
      synth.getVoices();
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
    
    populateVoices();
    
    // Cleanup
    return () => {
      synth.cancel();
    };
  }, []);

  // Speak new AI messages when they arrive
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.role === 'assistant') {
      speakText(latestMessage.content);
    }
  }, [messages]);

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Input Activated",
        description: "Hayagriva is now listening. Speak clearly to send your message."
      });
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        const recognizedText = "What is the concept of dharma in Indian philosophy?";
        setInput(recognizedText);
        setIsListening(false);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const scrollToChat = () => {
    setShowChat(true);
    setTimeout(() => {
      document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Get the most recent AI message for voice output
  const latestAIMessage = messages.filter(msg => msg.role === 'assistant').slice(-1)[0]?.content || "";

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

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0"></div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
        
        <div className="z-10 text-center max-w-4xl">
          <div className="mb-8 animate-floating">
            <HayagrivaLogoHorse className="mx-auto w-32 h-32" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Hayagriva</span> AI Ascend
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            The advanced AI assistant with an authentic Indian voice and comprehensive knowledge across all domains
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={scrollToChat}>
              Start Conversation
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 w-full flex justify-center animate-bounce">
          <Button variant="ghost" size="icon" onClick={scrollToChat}>
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="gradient-text">Key Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section id="chat-section" className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <span className="gradient-text">Experience Hayagriva</span>
          </h2>
          
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Start a conversation with Hayagriva and experience the future of AI assistance with an Indian perspective.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card shadow-lg rounded-2xl border border-border overflow-hidden">
              <div className="p-3 border-b border-border flex justify-between items-center">
                <div className="flex items-center">
                  <HayagrivaLogoHorse className="w-6 h-6 mr-2" />
                  <span className="font-medium">Hayagriva Assistant</span>
                </div>
                
                {/* Voice toggle replaced with indication that voice is always on */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                    Voice Active
                  </span>
                </div>
              </div>
              
              <Chat messages={messages} />
              
              <div className="p-4 border-t border-border flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={isListening ? "text-destructive" : ""}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
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

      {/* Footer */}
      <footer className="py-8 px-4 bg-accent/30 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Hayagriva AI Ascend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
