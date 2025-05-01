
import React from 'react';
import { Badge } from "@/components/ui/badge";
import HayagrivaLogo from '@/components/HayagrivaLogo';

interface RealTimeStats {
  linesOfCode: number;
  components: number;
  efficiency: number;
  completionRate: number;
}

interface WebAppHeaderProps {
  realtimeStats?: RealTimeStats;
  generating?: boolean;
}

const WebAppHeader: React.FC<WebAppHeaderProps> = ({ realtimeStats, generating }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
      <div className="flex items-center gap-2">
        <HayagrivaLogo className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">Hayagriva Web App Creator</h1>
          <p className="text-muted-foreground">Generate custom web applications with AI</p>
        </div>
      </div>
      
      {generating && realtimeStats && (
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="font-mono">
            Lines: {realtimeStats.linesOfCode}
          </Badge>
          <Badge variant="outline" className="font-mono">
            Components: {realtimeStats.components}
          </Badge>
          <Badge variant="outline" className="font-mono">
            Efficiency: {realtimeStats.efficiency}%
          </Badge>
          <Badge variant="secondary" className="font-mono animate-pulse">
            Generation: {realtimeStats.completionRate}%
          </Badge>
        </div>
      )}
    </div>
  );
};

export default WebAppHeader;
