
import React, { useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { generateAppCode, generateCode } from "@/utils/codeGenerator";

// Import refactored components
import { WebAppGeneratorProvider, useWebAppGenerator } from "@/components/web-app-creator/WebAppGeneratorContext";
import WebAppHeader from "@/components/web-app-creator/WebAppHeader";
import WebAppTabs from "@/components/web-app-creator/WebAppTabs";
import WebAppChat from "@/components/web-app-creator/WebAppChat";
import GenerationHistory from "@/components/web-app-creator/GenerationHistory";
import ProTipAlert from "@/components/web-app-creator/ProTipAlert";

const WebAppCreatorContent = () => {
  const {
    loading,
    setLoading,
    generating,
    setGenerating,
    setActiveTab,
    appPrompt,
    setAppPrompt,
    setGeneratedCode,
    setPreviewUrl,
    setProgress,
    setLivePreviewUrl,
    generationHistory,
    setGenerationHistory,
    settings
  } = useWebAppGenerator();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
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
            framework: settings.framework,
            cssFramework: settings.cssFramework,
            responsive: settings.responsive,
            accessibility: settings.accessibility
          });
        }
        
        setGeneratedCode(generatedAppCode);

        // Generate a random color for preview based on app type
        const colorOptions = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'];
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        // Set preview URL
        const previewUrl = `https://placehold.co/800x600/${randomColor}/ffffff?text=${encodeURIComponent(appName)}`;
        setPreviewUrl(previewUrl);
        
        // Set a live preview URL
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
    }
  };

  const handleCopyCode = (code: string) => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast({
        title: "Code copied",
        description: "The generated code has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadCode = (code: string) => {
    if (code) {
      const blob = new Blob([code], { type: 'text/javascript' });
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
    setAppPrompt(message);
  };

  const handleOpenLivePreview = () => {
    window.open('https://hayagriva-preview-demo.vercel.app', '_blank');
    
    toast({
      title: "Live preview opened",
      description: "Your application preview has been opened in a new tab.",
    });
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
  };

  return (
    <div className="container mx-auto py-6">
      <WebAppHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WebAppTabs 
            handleGenerate={handleGenerate}
            handleCopyCode={() => handleCopyCode(generatedCode)}
            handleDownloadCode={() => handleDownloadCode(generatedCode)}
            handleOpenLivePreview={handleOpenLivePreview}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
        </div>
        
        <div className="space-y-6">
          <WebAppChat 
            onChatMessage={handleChatMessage}
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

const WebAppCreatorPage = () => {
  return (
    <WebAppGeneratorProvider>
      <WebAppCreatorContent />
    </WebAppGeneratorProvider>
  );
};

export default WebAppCreatorPage;
