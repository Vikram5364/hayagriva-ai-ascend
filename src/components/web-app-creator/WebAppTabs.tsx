
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppPromptInput from "./AppPromptInput";
import AdvancedSettings from "./AdvancedSettings";
import GenerationProgress from "./GenerationProgress";
import CodeView from "./CodeView";
import AppPreview from "./AppPreview";
import { useWebAppGenerator } from './WebAppGeneratorContext';

interface WebAppTabsProps {
  handleGenerate: () => void;
  handleCopyCode: () => void;
  handleDownloadCode: () => void;
  handleOpenLivePreview: () => void;
  suggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
}

const WebAppTabs: React.FC<WebAppTabsProps> = ({
  handleGenerate,
  handleCopyCode,
  handleDownloadCode,
  handleOpenLivePreview,
  suggestions,
  handleSuggestionClick,
}) => {
  const {
    activeTab,
    setActiveTab,
    appPrompt,
    setAppPrompt,
    generating,
    progress,
    showAdvanced,
    generatedCode,
    previewUrl,
    livePreviewUrl,
    settings,
    updateSettings
  } = useWebAppGenerator();

  const promptRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="space-y-4">
        <AppPromptInput 
          appPrompt={appPrompt}
          setAppPrompt={setAppPrompt}
          generating={generating}
          handleGenerate={handleGenerate}
          promptRef={promptRef}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
        />
        
        {showAdvanced && (
          <AdvancedSettings
            framework={settings.framework}
            setFramework={(value) => updateSettings({ framework: value })}
            cssFramework={settings.cssFramework}
            setCssFramework={(value) => updateSettings({ cssFramework: value })}
            responsive={settings.responsive}
            setResponsive={(value) => updateSettings({ responsive: value })}
            accessibility={settings.accessibility}
            setAccessibility={(value) => updateSettings({ accessibility: value })}
          />
        )}
        
        {generating && <GenerationProgress progress={progress} />}
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
          setActiveTab={setActiveTab}
          onOpenLiveDemo={handleOpenLivePreview}
          hasLivePreview={!!livePreviewUrl}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WebAppTabs;
