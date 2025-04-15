
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  progress: number;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">Generating your app...</span>
        <span className="text-sm">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default GenerationProgress;
