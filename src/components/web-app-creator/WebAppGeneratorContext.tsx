
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppSettings {
  framework: string;
  cssFramework: string;
  responsive: boolean;
  accessibility: boolean;
  darkMode: boolean;
}

interface HistoryItem {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  preview: string;
  prompt: string;
  code: string;
}

interface WebAppGeneratorContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
  generating: boolean;
  setGenerating: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  appPrompt: string;
  setAppPrompt: (value: string) => void;
  generatedCode: string;
  setGeneratedCode: (value: string) => void;
  previewUrl: string;
  setPreviewUrl: (value: string) => void;
  progress: number;
  setProgress: (value: number) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  livePreviewUrl: string | null;
  setLivePreviewUrl: (value: string | null) => void;
  generationHistory: HistoryItem[];
  setGenerationHistory: (value: HistoryItem[]) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  framework: "react",
  cssFramework: "tailwind",
  responsive: true,
  accessibility: true,
  darkMode: false,
};

const WebAppGeneratorContext = createContext<WebAppGeneratorContextType | undefined>(undefined);

export const WebAppGeneratorProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [appPrompt, setAppPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({...prev, ...newSettings}));
  };
  
  const value = {
    loading,
    setLoading,
    generating,
    setGenerating,
    activeTab,
    setActiveTab,
    appPrompt,
    setAppPrompt,
    generatedCode,
    setGeneratedCode,
    previewUrl,
    setPreviewUrl,
    progress,
    setProgress,
    showAdvanced,
    setShowAdvanced,
    livePreviewUrl,
    setLivePreviewUrl,
    generationHistory,
    setGenerationHistory,
    settings,
    updateSettings,
  };
  
  return (
    <WebAppGeneratorContext.Provider value={value}>
      {children}
    </WebAppGeneratorContext.Provider>
  );
};

export const useWebAppGenerator = (): WebAppGeneratorContextType => {
  const context = useContext(WebAppGeneratorContext);
  if (context === undefined) {
    throw new Error('useWebAppGenerator must be used within a WebAppGeneratorProvider');
  }
  return context;
};
