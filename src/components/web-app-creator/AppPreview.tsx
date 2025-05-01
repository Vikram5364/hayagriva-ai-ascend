
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface RealTimeStats {
  linesOfCode: number;
  components: number;
  efficiency: number;
  completionRate: number;
}

interface AppPreviewProps {
  previewUrl: string;
  livePreviewUrl: string | null;
  handleOpenLivePreview: () => void;
  realtimeStats?: RealTimeStats;
}

const AppPreview: React.FC<AppPreviewProps> = ({ 
  previewUrl, 
  livePreviewUrl, 
  handleOpenLivePreview,
  realtimeStats
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preview</CardTitle>
        <CardDescription>
          See how your generated application looks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative rounded-md overflow-hidden border aspect-video bg-secondary/20">
              <img 
                src={previewUrl} 
                alt="App preview" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {livePreviewUrl && (
              <div className="flex justify-center">
                <Button onClick={handleOpenLivePreview}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Live Preview
                </Button>
              </div>
            )}
            
            {realtimeStats && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <p className="text-muted-foreground">App Size</p>
                  <p className="font-mono text-lg">{realtimeStats.linesOfCode} lines</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Components</p>
                  <p className="font-mono text-lg">{realtimeStats.components}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance Score</p>
                  <p className="font-mono text-lg">{realtimeStats.efficiency}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-mono text-lg font-medium text-green-500">Ready</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No preview available yet. Go to the Create tab to generate your app.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {}}
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
