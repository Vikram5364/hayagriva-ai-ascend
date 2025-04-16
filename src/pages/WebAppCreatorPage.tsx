
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Chat from "@/components/Chat";
import HayagrivaPowerLogo from "@/components/HayagrivaPowerLogo";
import { generateAppCode, generateCode } from "@/utils/codeGenerator";

// Import refactored components
import AppPromptInput from "@/components/web-app-creator/AppPromptInput";
import AdvancedSettings from "@/components/web-app-creator/AdvancedSettings";
import GenerationProgress from "@/components/web-app-creator/GenerationProgress";
import CodeView from "@/components/web-app-creator/CodeView";
import AppPreview from "@/components/web-app-creator/AppPreview";
import GenerationHistory from "@/components/web-app-creator/GenerationHistory";
import ProTipAlert from "@/components/web-app-creator/ProTipAlert";

const WebAppCreatorPage = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [appPrompt, setAppPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    id: string;
    name: string;
    description: string;
    timestamp: string;
    preview: string;
    prompt: string;
    code: string;
  }>>([]);

  const codeRef = useRef<HTMLPreElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);

  // Framework and styling options (for advanced settings)
  const [framework, setFramework] = useState("react");
  const [cssFramework, setCssFramework] = useState("tailwind");
  const [responsive, setResponsive] = useState(true);
  const [accessibility, setAccessibility] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages([
        { 
          role: "assistant", 
          content: "Welcome to the Hayagriva Web App Creator! Just tell me what kind of web app you want to build, and I'll generate it for you. Be as descriptive as possible for better results." 
        }
      ]);
      
      // Load sample history
      setGenerationHistory([
        {
          id: "1",
          name: "Analytics Dashboard",
          description: "A responsive dashboard with charts and data visualization",
          timestamp: "2023-10-15T14:30:00",
          preview: "https://placehold.co/600x400/3b82f6/ffffff?text=Analytics+Dashboard",
          prompt: "Create an analytics dashboard with charts and data visualization",
          code: "// Sample analytics dashboard code"
        },
        {
          id: "2",
          name: "E-commerce Store",
          description: "Online store with product listings and shopping cart",
          timestamp: "2023-10-14T10:15:00",
          preview: "https://placehold.co/600x400/8b5cf6/ffffff?text=E-commerce+Store",
          prompt: "Create an e-commerce store with product listings and a shopping cart",
          code: "// Sample e-commerce store code"
        }
      ]);
    }, 1000);
  }, []);

  const handleGenerate = async () => {
    if (!appPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a description of the app you want to create.",
        variant: "destructive"
      });
      return;
    }

    // Extract app name from prompt for better UX
    const nameMatch = appPrompt.match(/(?:create|build|make|develop|generate)\s+(?:an?|the)\s+(\w+(?:\s+\w+){0,3})/i);
    const appName = nameMatch ? nameMatch[1] : "Web App";
    
    setGenerating(true);
    setProgress(0);
    
    setMessages(prev => [...prev, {
      role: "user",
      content: appPrompt
    }]);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      // Generate app code based on prompt
      setTimeout(() => {
        let generatedAppCode;
        
        // Determine if this is a code generation request or app generation request
        if (/function|algorithm|code|write|script|program/i.test(appPrompt)) {
          generatedAppCode = generateCode(appPrompt);
        } else {
          // Generate actual app code based on the prompt
          generatedAppCode = generateAppCode(appPrompt, {
            framework,
            cssFramework,
            responsive,
            accessibility
          });
        }
        
        setGeneratedCode(generatedAppCode);

        // Generate a random color for preview based on app type
        const colorOptions = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'];
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        // Set preview URL
        const previewUrl = `https://placehold.co/800x600/${randomColor}/ffffff?text=${encodeURIComponent(appName)}`;
        setPreviewUrl(previewUrl);
        
        // Set a dummy live preview URL (in a real implementation, this would be a deployed version)
        setLivePreviewUrl(`https://hayagriva-preview-${Date.now()}.vercel.app`);
        
        // Add to history
        const newHistoryItem = {
          id: Date.now().toString(),
          name: appName,
          description: appPrompt.length > 100 ? appPrompt.slice(0, 97) + '...' : appPrompt,
          timestamp: new Date().toISOString(),
          preview: `https://placehold.co/600x400/${randomColor}/ffffff?text=${encodeURIComponent(appName)}`,
          prompt: appPrompt,
          code: generatedAppCode
        };
        
        setGenerationHistory(prev => [newHistoryItem, ...prev]);
        
        // Set progress to 100%
        clearInterval(interval);
        setProgress(100);
        
        // Add assistant response
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `I've generated your ${appName} application! You can view the code, preview it, or download it to use in your projects.`
        }]);
        
        setGenerating(false);
        setActiveTab("code");
      }, 3000);
    } catch (error) {
      clearInterval(interval);
      setGenerating(false);
      setProgress(0);
      
      toast({
        title: "Generation failed",
        description: "There was a problem generating your app. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, but I encountered an error while trying to generate your app. Please try again with a more specific description."
      }]);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Code copied",
        description: "The generated code has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadCode = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hayagriva-app.jsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Code downloaded",
        description: "Your app code has been downloaded successfully.",
      });
    }
  };

  const handleDeleteHistory = (id: string) => {
    setGenerationHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Project deleted",
      description: "The project has been removed from your history.",
    });
  };

  const handleLoadFromHistory = (item: any) => {
    setAppPrompt(item.prompt);
    setGeneratedCode(item.code);
    setPreviewUrl(item.preview);
    setActiveTab("create");
    toast({
      title: "Project loaded",
      description: `"${item.name}" has been loaded for editing.`,
    });
  };

  const handleChatMessage = (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setAppPrompt(message);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I'll help you create a web app based on: "${message}". Click the "Generate App" button when you're ready!`
      }]);
    }, 800);
  };

  const handleOpenLivePreview = () => {
    if (livePreviewUrl) {
      window.open(livePreviewUrl, '_blank');
      
      toast({
        title: "Live preview opened",
        description: "Your application preview has been opened in a new tab.",
      });
    } else {
      toast({
        title: "Preview not available",
        description: "Please generate an app first to view a live preview.",
        variant: "destructive"
      });
    }
  };

  // Example app suggestions
  const suggestions = [
    "Create a task management app with dark mode",
    "Build an e-commerce store with product listings and cart",
    "Generate a personal portfolio website with contact form",
    "Make a recipe finder app with search functionality",
    "Design a fitness tracking dashboard with charts"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setAppPrompt(suggestion);
    if (promptRef.current) {
      promptRef.current.focus();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HayagrivaPowerLogo className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Hayagriva Web App Creator</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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
                  framework={framework}
                  setFramework={setFramework}
                  cssFramework={cssFramework}
                  setCssFramework={setCssFramework}
                  responsive={responsive}
                  setResponsive={setResponsive}
                  accessibility={accessibility}
                  setAccessibility={setAccessibility}
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
        </div>
        
        <div className="space-y-6">
          <Chat 
            messages={messages} 
            onVoiceInput={handleChatMessage}
          />
          
          <GenerationHistory 
            loading={loading}
            generationHistory={generationHistory}
            handleLoadFromHistory={handleLoadFromHistory}
            handleDeleteHistory={handleDeleteHistory}
          />
          
          <ProTipAlert />
        </div>
      </div>
    </div>
  );
};

export default WebAppCreatorPage;
