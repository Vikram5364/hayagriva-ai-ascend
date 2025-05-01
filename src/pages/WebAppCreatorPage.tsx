import React, { useRef, useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { generateAppCode, generateCode } from "@/utils/codeGenerator";
import { parseAppRequirements } from "@/utils/promptParser";

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
    generatedCode,
    setGeneratedCode,
    setPreviewUrl,
    progress,
    setProgress,
    setLivePreviewUrl,
    generationHistory,
    setGenerationHistory,
    settings,
    updateSettings
  } = useWebAppGenerator();
  
  const [realtimeStats, setRealtimeStats] = useState({
    linesOfCode: 0,
    components: 0,
    efficiency: 0,
    completionRate: 0
  });

  const progressInterval = useRef<number | null>(null);
  const statsInterval = useRef<number | null>(null);

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
          code: "// Sample analytics dashboard code",
          stats: {
            linesOfCode: 250,
            components: 8,
            efficiency: 92
          }
        },
        {
          id: "2",
          name: "E-commerce Store",
          description: "Online store with product listings and shopping cart",
          timestamp: "2023-10-14T10:15:00",
          preview: "https://placehold.co/600x400/8b5cf6/ffffff?text=E-commerce+Store",
          prompt: "Create an e-commerce store with product listings and a shopping cart",
          code: "// Sample e-commerce store code",
          stats: {
            linesOfCode: 320,
            components: 12,
            efficiency: 88
          }
        }
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    // Cleanup intervals when component unmounts
    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
      if (statsInterval.current) {
        window.clearInterval(statsInterval.current);
      }
    };
  }, []);

  // Update real-time statistics based on generation progress
  useEffect(() => {
    if (generating) {
      if (statsInterval.current) {
        window.clearInterval(statsInterval.current);
      }
      
      statsInterval.current = window.setInterval(() => {
        const progressPercentage = progress;
        
        // Calculate dynamic statistics based on progress
        setRealtimeStats(prev => ({
          linesOfCode: Math.floor(100 + (progressPercentage * 5)),
          components: Math.floor(3 + (progressPercentage / 20)),
          efficiency: Math.min(95, Math.floor(60 + (progressPercentage / 3))),
          completionRate: Math.floor(progressPercentage)
        }));
        
        if (progressPercentage >= 100) {
          window.clearInterval(statsInterval.current!);
        }
      }, 200);
    } else {
      if (statsInterval.current) {
        window.clearInterval(statsInterval.current);
      }
    }
  }, [generating, progress]);

  const handleGenerate = async () => {
    if (!appPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a description of the app you want to create.",
        variant: "destructive"
      });
      return;
    }

    // Parse requirements from prompt
    const requirements = parseAppRequirements(appPrompt);
    
    // Extract app name from requirements
    const appName = requirements.appName || "Web App";
    
    setGenerating(true);
    setProgress(0);

    // Clear any existing intervals
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }

    // Set up real-time progress updates
    progressInterval.current = window.setInterval(() => {
      setProgress((prevProgress) => {
        const increment = Math.random() * 5 + (prevProgress > 80 ? 0.5 : 3);
        const newProgress = prevProgress + increment;
        
        if (newProgress >= 98) {
          window.clearInterval(progressInterval.current!);
          return 98; // Hold at 98% until actual completion
        }
        return newProgress;
      });
    }, 300);

    try {
      // Simulate API call with timeout proportional to prompt complexity
      const complexityFactor = appPrompt.length / 50;
      const simulatedDelay = Math.max(2000, Math.min(4000, complexityFactor * 500));
      
      setTimeout(() => {
        let generatedAppCode;
        
        // Determine if this is a code generation request or app generation request
        if (/function|algorithm|code|write|script|program/i.test(appPrompt)) {
          generatedAppCode = generateCode(appPrompt);
        } else {
          // Generate actual app code based on the prompt
          // Update to include features only if they're available
          const appOptions = {
            framework: settings.framework,
            cssFramework: settings.cssFramework,
            responsive: settings.responsive,
            accessibility: settings.accessibility
          };
          
          // Only add features if they exist in requirements
          if (requirements.features && requirements.features.length > 0) {
            updateSettings({ features: requirements.features });
          }
          
          generatedAppCode = generateAppCode(appPrompt, {
            ...appOptions,
            appType: requirements.appType
          });
        }
        
        setGeneratedCode(generatedAppCode);

        // Generate a random color for preview based on app type
        let themeColor;
        switch (requirements.appType) {
          case 'dashboard':
            themeColor = '3b82f6'; // blue
            break;
          case 'ecommerce': 
            themeColor = '8b5cf6'; // purple
            break;
          case 'blog':
            themeColor = '10b981'; // green
            break;
          case 'portfolio':
            themeColor = 'f59e0b'; // amber
            break;
          case 'social':
            themeColor = 'ef4444'; // red
            break;
          case 'taskmanager':
            themeColor = '8b5cf6'; // purple
            break;
          default:
            const colorOptions = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444'];
            themeColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        }
        
        // Set preview URL
        const previewUrl = `https://placehold.co/800x600/${themeColor}/ffffff?text=${encodeURIComponent(appName)}`;
        setPreviewUrl(previewUrl);
        
        // Set a live preview URL with unique identifier
        const timestamp = Date.now();
        setLivePreviewUrl(`https://hayagriva-preview-${timestamp}.vercel.app`);
        
        // Add to history
        const newHistoryItem = {
          id: timestamp.toString(),
          name: appName,
          description: appPrompt.length > 100 ? appPrompt.slice(0, 97) + '...' : appPrompt,
          timestamp: new Date().toISOString(),
          preview: `https://placehold.co/600x400/${themeColor}/ffffff?text=${encodeURIComponent(appName)}`,
          prompt: appPrompt,
          code: generatedAppCode,
          stats: {
            linesOfCode: realtimeStats.linesOfCode,
            components: realtimeStats.components,
            efficiency: realtimeStats.efficiency
          }
        };
        
        // Fix: Create a new array with the existing history and the new item
        const updatedHistory = [newHistoryItem];
        if (Array.isArray(generationHistory)) {
          updatedHistory.push(...generationHistory);
        }
        setGenerationHistory(updatedHistory);
        
        // Set progress to 100%
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
        setProgress(100);
        
        setGenerating(false);
        setActiveTab("code");
        
        toast({
          title: "App generated successfully",
          description: `Your ${appName} application has been created!`,
        });
      }, simulatedDelay);
    } catch (error) {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
      setGenerating(false);
      setProgress(0);
      
      toast({
        title: "Generation failed",
        description: "There was a problem generating your app. Please try again.",
        variant: "destructive"
      });
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
    // Fix: Filter the array first, then set it directly
    if (!Array.isArray(generationHistory)) {
      return;
    }
    
    const filteredHistory = generationHistory.filter(item => item.id !== id);
    setGenerationHistory(filteredHistory);
    
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
      <WebAppHeader realtimeStats={realtimeStats} generating={generating} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WebAppTabs 
            handleGenerate={handleGenerate}
            handleCopyCode={handleCopyCode}
            handleDownloadCode={handleDownloadCode}
            handleOpenLivePreview={handleOpenLivePreview}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            realtimeStats={realtimeStats}
            generating={generating}
          />
        </div>
        
        <div className="space-y-6">
          <WebAppChat 
            onChatMessage={handleChatMessage}
            generating={generating}
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
