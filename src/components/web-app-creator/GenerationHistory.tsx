
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";

interface HistoryItem {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  preview: string;
  prompt: string;
  code: string;
}

interface GenerationHistoryProps {
  loading: boolean;
  generationHistory: HistoryItem[];
  handleLoadFromHistory: (item: HistoryItem) => void;
  handleDeleteHistory: (id: string) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  loading,
  generationHistory,
  handleLoadFromHistory,
  handleDeleteHistory,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generation History</CardTitle>
        <CardDescription>Your previously generated apps</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : generationHistory.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {generationHistory.map((item) => (
                <div key={item.id} className="flex flex-col space-y-2">
                  <div 
                    className="relative cursor-pointer rounded-md overflow-hidden"
                    onClick={() => handleLoadFromHistory(item)}
                  >
                    <img 
                      src={item.preview} 
                      alt={item.name} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm">
                        Load Project
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteHistory(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-2">
              No generation history yet
            </p>
            <p className="text-xs text-muted-foreground">
              Your generated apps will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
