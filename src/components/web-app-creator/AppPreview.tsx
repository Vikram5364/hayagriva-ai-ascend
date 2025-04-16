
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface AppPreviewProps {
  previewUrl: string;
  setActiveTab: (value: string) => void;
  onOpenLiveDemo?: () => void;
  hasLivePreview?: boolean;
}

const AppPreview: React.FC<AppPreviewProps> = ({ 
  previewUrl, 
  setActiveTab, 
  onOpenLiveDemo,
  hasLivePreview = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preview</CardTitle>
        <CardDescription>
          Visual preview of your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          <div className="border rounded-md overflow-hidden">
            <img 
              src={previewUrl} 
              alt="App Preview" 
              className="w-full h-auto"
            />
            <div className="p-4 bg-secondary flex justify-center">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={onOpenLiveDemo}
                disabled={!hasLivePreview}
              >
                <Play className="h-4 w-4" />
                Open Live Demo
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No preview available yet. Generate your app first.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("create")}
            >
              Go to Create
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppPreview;
