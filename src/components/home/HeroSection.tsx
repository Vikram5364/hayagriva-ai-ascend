
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';
import HayagrivaLogoHorseUpdate from '@/components/HayagrivaLogoHorseUpdate';

interface HeroSectionProps {
  scrollToChat: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToChat }) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0"></div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
      
      <div className="z-10 text-center max-w-4xl">
        <div className="mb-8 animate-floating">
          <HayagrivaLogoHorseUpdate className="mx-auto w-32 h-32" />
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
  );
};

export default HeroSection;
