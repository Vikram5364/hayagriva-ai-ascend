
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebAppGenerator } from './WebAppGeneratorContext';
import AppPromptInput from './AppPromptInput';
import CodeView from './CodeView';
import AppPreview from './AppPreview';
import GenerationProgress from './GenerationProgress';
import AdvancedSettings from './AdvancedSettings';

interface RealTimeStats {
  linesOfCode: number;
  components: number;
  efficiency: number;
  completionRate: number;
}

interface WebAppTabsProps {
  handleGenerate: () => void;
  handleCopyCode: () => void;
  handleDownloadCode: () => void;
  handleOpenLivePreview: () => void;
  suggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
  realtimeStats?: RealTimeStats;
  generating?: boolean;
}

const WebAppTabs: React.FC<WebAppTabsProps> = ({
  handleGenerate,
  handleCopyCode,
  handleDownloadCode,
  handleOpenLivePreview,
  suggestions,
  handleSuggestionClick,
  realtimeStats,
  generating
}) => {
  const {
    activeTab,
    setActiveTab,
    appPrompt,
    setAppPrompt,
    generatedCode,
    previewUrl,
    livePreviewUrl,
    progress,
    showAdvanced,
    setShowAdvanced
  } = useWebAppGenerator();
  
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="space-y-4">
        <AppPromptInput 
          appPrompt={appPrompt}
          setAppPrompt={setAppPrompt}
          generating={generating || false}
          handleGenerate={handleGenerate}
          promptRef={promptRef}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
        />
        
        {generating && (
          <GenerationProgress 
            progress={progress} 
            realtimeStats={realtimeStats}
          />
        )}
        
        <AdvancedSettings 
          showAdvanced={showAdvanced} 
          setShowAdvanced={setShowAdvanced} 
        />
      </TabsContent>
      
      <TabsContent value="code">
        <CodeView 
          generatedCode={generatedCode}
          codeRef={codeRef}
          handleCopyCode={handleCopyCode}
          handleDownloadCode={handleDownloadCode}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="preview">
        <AppPreview 
          previewUrl={previewUrl} 
          livePreviewUrl={livePreviewUrl} 
          handleOpenLivePreview={handleOpenLivePreview}
          realtimeStats={realtimeStats}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WebAppTabs;
