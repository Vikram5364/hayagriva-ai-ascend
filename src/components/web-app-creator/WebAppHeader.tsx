
import React from 'react';
import { Button } from "@/components/ui/button";
import HayagrivaPowerLogo from "@/components/HayagrivaPowerLogo";
import { useWebAppGenerator } from './WebAppGeneratorContext';

const WebAppHeader: React.FC = () => {
  const { showAdvanced, setShowAdvanced, settings, updateSettings } = useWebAppGenerator();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <HayagrivaPowerLogo className="h-10 w-10" />
        <h1 className="text-2xl font-bold">Hayagriva Web App Creator</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
        >
          {settings.darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </div>
  );
};

export default WebAppHeader;
