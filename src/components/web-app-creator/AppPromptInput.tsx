
import React, { RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

interface AppPromptInputProps {
  appPrompt: string;
  setAppPrompt: (value: string) => void;
  generating: boolean;
  handleGenerate: () => void;
  promptRef: RefObject<HTMLTextAreaElement>;
  suggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
}

const AppPromptInput: React.FC<AppPromptInputProps> = ({
  appPrompt,
  setAppPrompt,
  generating,
  handleGenerate,
  promptRef,
  suggestions,
  handleSuggestionClick,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Web App</CardTitle>
        <CardDescription>Describe the web app you want to create and I'll generate it for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="app-prompt">App Description</Label>
          <Textarea 
            id="app-prompt" 
            ref={promptRef}
            placeholder="Describe the app you want to create in detail. Example: Create a task management app with categories, dark mode, and user authentication." 
            value={appPrompt} 
            onChange={(e) => setAppPrompt(e.target.value)} 
            rows={5}
            className="resize-y min-h-[100px] max-h-[300px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Need inspiration? Try these examples:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions.map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleGenerate} 
          disabled={generating || !appPrompt.trim()}
          className="gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate App
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppPromptInput;
