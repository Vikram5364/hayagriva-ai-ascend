
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Copy, Download, Loader2, RefreshCw, Trash, Upload, Sparkles, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Chat from "@/components/Chat";
import HayagrivaPowerLogo from "@/components/HayagrivaPowerLogo";
import { generateAppCode } from "@/utils/codeGenerator";

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
        // This would eventually be replaced with an actual AI code generation call
        const generatedAppCode = generateAppCode(appPrompt, {
          framework,
          cssFramework,
          responsive,
          accessibility
        });
        
        setGeneratedCode(generatedAppCode);

        // Generate a random color for preview based on app type
        const colorOptions = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'];
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        // Set preview URL
        setPreviewUrl(`https://placehold.co/800x600/${randomColor}/ffffff?text=${encodeURIComponent(appName)}`);
        
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
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Web App</CardTitle>
                  <CardDescription>Describe the web app you want to create and I'll generate it for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-prompt">App Description</Label>
                    <Textarea 
                      id="app-prompt" 
                      ref={promptRef}
                      placeholder="Describe the app you want to create in detail. Example: Create a task management app with categories, dark mode, and user authentication." 
                      value={appPrompt} 
                      onChange={(e) => setAppPrompt(e.target.value)} 
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Need inspiration? Try these examples:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {suggestions.map((suggestion, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {appPrompt.length} / 500 characters
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={generating || !appPrompt.trim()}
                    className="gap-2"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate App
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {showAdvanced && (
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Configure technical aspects of your app</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="framework">Framework</Label>
                      <Select value={framework} onValueChange={setFramework}>
                        <SelectTrigger id="framework">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="vue">Vue</SelectItem>
                          <SelectItem value="angular">Angular</SelectItem>
                          <SelectItem value="svelte">Svelte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="css-framework">CSS Framework</Label>
                      <Select value={cssFramework} onValueChange={setCssFramework}>
                        <SelectTrigger id="css-framework">
                          <SelectValue placeholder="Select CSS framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                          <SelectItem value="bootstrap">Bootstrap</SelectItem>
                          <SelectItem value="material">Material UI</SelectItem>
                          <SelectItem value="chakra">Chakra UI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="responsive" 
                        checked={responsive}
                        onCheckedChange={setResponsive}
                      />
                      <Label htmlFor="responsive">Responsive Design</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="accessibility" 
                        checked={accessibility}
                        onCheckedChange={setAccessibility}
                      />
                      <Label htmlFor="accessibility">Accessibility Features</Label>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {generating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generating your app...</span>
                    <span className="text-sm">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                  <CardDescription>
                    Here's the code for your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedCode ? (
                    <div className="relative">
                      <div className="absolute right-2 top-2 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleCopyCode}
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleDownloadCode}
                          title="Download code"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre 
                        ref={codeRef}
                        className="bg-secondary p-4 rounded-md overflow-x-auto text-sm h-[500px]"
                      >
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No code generated yet. Go to the Create tab to generate your app.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("create")}
                      >
                        Go to Create
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>App Preview</CardTitle>
                  <CardDescription>
                    Visual preview of your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewUrl ? (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="App Preview" 
                        className="w-full h-auto"
                      />
                      <div className="p-4 bg-secondary flex justify-center">
                        <Button variant="outline" className="gap-2">
                          <Play className="h-4 w-4" />
                          Open Live Demo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No preview available yet. Generate your app first.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("create")}
                      >
                        Go to Create
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Chat with Hayagriva for help</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Chat 
                messages={messages} 
                onVoiceInput={handleChatMessage}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Input 
                placeholder="Ask a question..." 
                className="mr-2" 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChatMessage((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button variant="secondary" size="sm">
                Send
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>Your previously generated apps</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : generationHistory.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {generationHistory.map((item) => (
                      <div key={item.id} className="flex flex-col space-y-2">
                        <div 
                          className="relative cursor-pointer rounded-md overflow-hidden"
                          onClick={() => handleLoadFromHistory(item)}
                        >
                          <img 
                            src={item.preview} 
                            alt={item.name} 
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm">
                              Load Project
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteHistory(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-2">
                    No generation history yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your generated apps will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pro Tip</AlertTitle>
            <AlertDescription>
              For better results, be detailed in your app description. Include features, design preferences, and functionality.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default WebAppCreatorPage;
