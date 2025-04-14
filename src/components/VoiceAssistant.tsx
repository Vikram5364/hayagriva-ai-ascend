
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Mic, MicOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface VoiceAssistantProps {
  text?: string;
  onVoiceInput?: (text: string) => void;
  iconOnly?: boolean;
  alwaysShowVoiceButton?: boolean;
}

const VoiceAssistant = ({ text, onVoiceInput, iconOnly = false, alwaysShowVoiceButton = false }: VoiceAssistantProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
    
    // Initialize speech recognition if browser supports it
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        // For the last result, if it's final, send it to the handler
        const lastResultIndex = event.results.length - 1;
        const lastResult = event.results[lastResultIndex];
        if (lastResult.isFinal && onVoiceInput) {
          onVoiceInput(lastResult[0].transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart recognition if it was still supposed to be listening
          try {
            recognitionRef.current?.start();
          } catch (err) {
            console.error('Error restarting speech recognition:', err);
          }
        }
      };
    }
    
    // Cleanup
    return () => {
      synth.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast, onVoiceInput, isListening]);

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
      
      // Auto-play the text when it's set
      synth.cancel();
      synth.speak(newUtterance);
      setIsSpeaking(true);
    }
  }, [text, voices, toast]);

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Voice Input Stopped",
        description: "No longer listening for voice input."
      });
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Voice Input Active",
          description: "Speak clearly into your microphone."
        });
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        toast({
          title: "Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={toggleListening}
        className="relative"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {(text || isSpeaking) && (
        <>
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
        </>
      )}

      {(onVoiceInput && alwaysShowVoiceButton) && (
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={toggleListening}
          className="relative"
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      )}
    </div>
  );
};

export default VoiceAssistant;
