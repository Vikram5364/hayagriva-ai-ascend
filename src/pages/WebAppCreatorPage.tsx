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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Copy, Download, Loader2, RefreshCw, Trash, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Chat from "@/components/Chat";
import HayagrivaPowerLogo from "@/components/HayagrivaPowerLogo";

const WebAppCreatorPage = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("design");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appType, setAppType] = useState("dashboard");
  const [colorScheme, setColorScheme] = useState("blue");
  const [features, setFeatures] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [responsive, setResponsive] = useState(true);
  const [accessibility, setAccessibility] = useState(true);
  const [framework, setFramework] = useState("react");
  const [cssFramework, setCssFramework] = useState("tailwind");
  const [generationHistory, setGenerationHistory] = useState<Array<{
    id: string;
    name: string;
    description: string;
    timestamp: string;
    preview: string;
  }>>([]);

  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages([
        { role: "assistant", content: "Welcome to the Hayagriva Web App Creator! I can help you design and generate code for your web application. What kind of app would you like to create?" }
      ]);
      
      setGenerationHistory([
        {
          id: "1",
          name: "Analytics Dashboard",
          description: "A responsive dashboard with charts and data visualization",
          timestamp: "2023-10-15T14:30:00",
          preview: "https://placehold.co/600x400/3b82f6/ffffff?text=Analytics+Dashboard"
        },
        {
          id: "2",
          name: "E-commerce Store",
          description: "Online store with product listings and shopping cart",
          timestamp: "2023-10-14T10:15:00",
          preview: "https://placehold.co/600x400/8b5cf6/ffffff?text=E-commerce+Store"
        }
      ]);
    }, 1500);
  }, []);

  const handleGenerate = () => {
    if (!appName || !appDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both app name and description.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    setProgress(0);
    
    setMessages(prev => [...prev, {
      role: "user",
      content: `Generate a ${appType} web app called "${appName}" with the following description: ${appDescription}. Use ${colorScheme} color scheme and include these features: ${features.join(", ")}.`
    }]);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGenerating(false);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `I've generated the code for "${appName}". You can preview it or download the source code.`
      }]);

      setGeneratedCode(`import React from 'react';
import { useState, useEffect } from 'react';

function ${appName.replace(/\s+/g, '')}() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app ${colorScheme}-theme">
      <header>
        <h1>${appName}</h1>
        <p>${appDescription}</p>
      </header>
      <main>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="content">
            ${features.map(feature => `<section className="feature">${feature}</section>`).join('\n            ')}
          </div>
        )}
      </main>
    </div>
  );
}

export default ${appName.replace(/\s+/g, '')};`);

      setPreviewUrl(`https://placehold.co/800x600/${colorScheme === 'blue' ? '3b82f6' : colorScheme === 'purple' ? '8b5cf6' : colorScheme === 'green' ? '10b981' : 'f59e0b'}/ffffff?text=${encodeURIComponent(appName)}`);
      
      const newHistoryItem = {
        id: Date.now().toString(),
        name: appName,
        description: appDescription,
        timestamp: new Date().toISOString(),
        preview: previewUrl || `https://placehold.co/600x400/${colorScheme === 'blue' ? '3b82f6' : colorScheme === 'purple' ? '8b5cf6' : colorScheme === 'green' ? '10b981' : 'f59e0b'}/ffffff?text=${encodeURIComponent(appName)}`
      };
      
      setGenerationHistory(prev => [newHistoryItem, ...prev]);
      
      setActiveTab("code");
    }, 6000);
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
      a.download = `${appName.replace(/\s+/g, '-').toLowerCase()}.jsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  const handleDeleteHistory = (id: string) => {
    setGenerationHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Project deleted",
      description: "The project has been removed from your history.",
    });
  };

  const handleLoadFromHistory = (item: any) => {
    setAppName(item.name);
    setAppDescription(item.description);
    setPreviewUrl(item.preview);
    setActiveTab("design");
    toast({
      title: "Project loaded",
      description: `"${item.name}" has been loaded for editing.`,
    });
  };

  const handleChatMessage = (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I'll help you with "${message}". Let me suggest some features for your app based on your description.`
      }]);
    }, 1000);
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const navValue = e.currentTarget.getAttribute('data-nav') || '';
    const linkValue = e.currentTarget.getAttribute('data-link') || '';
    
    console.log(`Navigation: ${navValue}, Link: ${linkValue}`);
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
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Information</CardTitle>
                  <CardDescription>Define the basic details of your web application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">App Name</Label>
                    <Input 
                      id="app-name" 
                      placeholder="Enter app name" 
                      value={appName} 
                      onChange={(e) => setAppName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-description">Description</Label>
                    <Textarea 
                      id="app-description" 
                      placeholder="Describe what your app does" 
                      value={appDescription} 
                      onChange={(e) => setAppDescription(e.target.value)} 
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-type">App Type</Label>
                    <Select value={appType} onValueChange={setAppType}>
                      <SelectTrigger id="app-type">
                        <SelectValue placeholder="Select app type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="social">Social Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Color Scheme</Label>
                    <div className="flex gap-2">
                      {["blue", "purple", "green", "orange"].map((color) => (
                        <div 
                          key={color} 
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer border-2",
                            colorScheme === color ? "border-primary" : "border-transparent",
                            color === "blue" && "bg-blue-500",
                            color === "purple" && "bg-purple-500",
                            color === "green" && "bg-green-500",
                            color === "orange" && "bg-orange-500"
                          )}
                          onClick={() => setColorScheme(color)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>Select the features you want in your app</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-auth" 
                        checked={features.includes("Authentication")}
                        onCheckedChange={() => handleFeatureToggle("Authentication")}
                      />
                      <Label htmlFor="feature-auth">Authentication</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-api" 
                        checked={features.includes("API Integration")}
                        onCheckedChange={() => handleFeatureToggle("API Integration")}
                      />
                      <Label htmlFor="feature-api">API Integration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-charts" 
                        checked={features.includes("Charts & Graphs")}
                        onCheckedChange={() => handleFeatureToggle("Charts & Graphs")}
                      />
                      <Label htmlFor="feature-charts">Charts & Graphs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-forms" 
                        checked={features.includes("Form Handling")}
                        onCheckedChange={() => handleFeatureToggle("Form Handling")}
                      />
                      <Label htmlFor="feature-forms">Form Handling</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-dark" 
                        checked={features.includes("Dark Mode")}
                        onCheckedChange={() => handleFeatureToggle("Dark Mode")}
                      />
                      <Label htmlFor="feature-dark">Dark Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="feature-notifications" 
                        checked={features.includes("Notifications")}
                        onCheckedChange={() => handleFeatureToggle("Notifications")}
                      />
                      <Label htmlFor="feature-notifications">Notifications</Label>
                    </div>
                  </div>
                </CardContent>
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
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !appName || !appDescription}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate App"
                  )}
                </Button>
              </div>
              
              {generating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generating your app...</span>
                    <span className="text-sm">{progress}%</span>
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
                    Here's the code for your {appName} application
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
                        className="bg-secondary p-4 rounded-md overflow-x-auto text-sm"
                      >
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No code generated yet. Go to the Design tab to create your app.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("design")}
                      >
                        Go to Design
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
                    Visual preview of your {appName} application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewUrl ? (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt={`Preview of ${appName}`} 
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No preview available yet. Generate your app first.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("design")}
                      >
                        Go to Design
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
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              You can use the AI assistant to help you design your app with natural language.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default WebAppCreatorPage;
