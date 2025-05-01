
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface RealTimeStats {
  linesOfCode: number;
  components: number;
  efficiency: number;
  completionRate: number;
}

interface GenerationProgressProps {
  progress: number;
  realtimeStats?: RealTimeStats;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress, realtimeStats }) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Generating your app...</span>
          <span className="text-sm font-mono">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {realtimeStats && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Lines of Code</p>
              <p className="font-mono text-lg">{realtimeStats.linesOfCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Components</p>
              <p className="font-mono text-lg">{realtimeStats.components}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Efficiency</p>
              <p className="font-mono text-lg">{realtimeStats.efficiency}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Completion</p>
              <p className="font-mono text-lg">{Math.round(realtimeStats.completionRate)}%</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GenerationProgress;
