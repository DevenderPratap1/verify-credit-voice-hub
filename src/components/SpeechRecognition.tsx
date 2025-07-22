import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SpeechRecognitionProps {
  onResult: (result: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onResult,
  isActive,
  onToggle,
}) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      // Handle results
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
        
        toast({
          title: "Speech recognized",
          description: `Captured: "${transcript}"`,
        });
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition failed. Please try again.";
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not available. Please check permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone permissions.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your connection.";
            break;
        }
        
        toast({
          title: "Speech Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };
      
      // Handle end of recognition
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
      
      // Handle start of recognition
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
          }
        }, 10000);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResult, toast]);

  useEffect(() => {
    if (isActive && isSupported && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Speech Recognition Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    } else if (!isActive && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isActive, isSupported, toast]);

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled
        className="shrink-0"
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="w-4 h-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      size="icon"
      onClick={onToggle}
      className={cn(
        "shrink-0 transition-smooth",
        isListening && "animate-pulse bg-destructive hover:bg-destructive/90"
      )}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <div className="flex items-center justify-center">
          <Volume2 className="w-4 h-4 animate-pulse" />
        </div>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SpeechRecognition;