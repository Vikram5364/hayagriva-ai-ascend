
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const VoiceAssistant = ({ text }: { text?: string }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Initialize voices
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
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

  useEffect(() => {
    if (text && !utterance) {
      const synth = window.speechSynthesis;
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      // Try to find an Indian English voice
      const indianVoice = voices.find(voice => 
        (voice.lang.includes('en-IN') || 
         voice.name.includes('Indian') || 
         voice.name.includes('Hindi'))
      );
      
      // Use a male voice preferably with Indian accent, or fallback to any English voice
      if (indianVoice) {
        newUtterance.voice = indianVoice;
      } else {
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en') && voice.name.includes('Male')
        );
        if (englishVoice) {
          newUtterance.voice = englishVoice;
        }
      }
      
      // Adjust parameters to simulate Indian accent if needed
      newUtterance.rate = 0.9; // Slightly slower
      newUtterance.pitch = 1.1; // Slightly higher pitch
      
      // Handle events
      newUtterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      newUtterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        toast({
          title: "Speech Error",
          description: "There was an error with the speech synthesis.",
          variant: "destructive"
        });
      };
      
      setUtterance(newUtterance);
    }
  }, [text, voices, toast, utterance]);

  const toggleSpeech = () => {
    const synth = window.speechSynthesis;
    
    if (!utterance || !text) {
      toast({
        title: "No content",
        description: "There is no text to speak.",
      });
      return;
    }
    
    if (isSpeaking) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      synth.cancel();
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const stopSpeech = () => {
    if (utterance) {
      const synth = window.speechSynthesis;
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSpeech}
        className="relative"
      >
        {isSpeaking ? (
          isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        {isSpeaking && !isPaused && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </Button>
      
      {isSpeaking && (
        <Button
          variant="outline"
          size="icon"
          onClick={stopSpeech}
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VoiceAssistant;
