
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, FileCode, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const WebAppCreatorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (prompt.trim() === '') {
      toast({
        title: "Empty prompt",
        description: "Please describe the web app you want to create",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate code generation with a delay
    setTimeout(() => {
      // Example generated code
      const mockGeneratedCode = {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Web App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <h1>Your Web App</h1>
    <div class="content">
      <!-- Content will be generated based on your description -->
      <p>This is a sample app based on: "${prompt}"</p>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
        'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

#app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

.content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}`,
        'app.js': `// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialized');
  
  // Add event listeners and app logic here
  const content = document.querySelector('.content');
  
  // Example of dynamic content
  const appDescription = document.createElement('div');
  appDescription.classList.add('app-description');
  appDescription.innerHTML = '<h2>App Features</h2><p>This is a generated web application scaffold.</p>';
  
  content.appendChild(appDescription);
});`
      };

      setGeneratedCode(mockGeneratedCode);
      setActiveTab('index.html');
      setIsGenerating(false);
      
      toast({
        title: "Code generated!",
        description: "Your web app code has been created successfully."
      });
    }, 2000);
  };

  const handleCopyCode = (code: string, filename: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${filename} code copied successfully.`
    });
  };

  const handleDownloadAll = () => {
    // Create a zip file (in a real implementation)
    // For now, just show a toast
    toast({
      title: "Download initiated",
      description: "In a production environment, this would download a zip with all files."
    });
  };

  const fileTabItems = Object.keys(generatedCode).map(filename => (
    <TabsTrigger key={filename} value={filename}>
      {filename}
    </TabsTrigger>
  ));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Web App Creator</h1>
          <p className="text-muted-foreground mb-6">
            Describe the web application you want to create, and our AI will generate the code for you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Describe Your Web App</CardTitle>
            <CardDescription>
              Provide details about the functionality, design, and purpose of your web application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., I want a todo list app with light/dark mode, local storage persistence, and the ability to categorize tasks..."
              className="h-32 mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="flex gap-2"
              >
                <Code className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Code"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {Object.keys(generatedCode).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>
                Review and download the code for your web application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {fileTabItems}
                </TabsList>
                <TabsContent value="description">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Web App Details</h3>
                    <p>This is a basic web application generated based on your description:</p>
                    <p className="mt-2 italic">"{prompt}"</p>
                    <div className="mt-4">
                      <h4 className="font-medium">Files Generated:</h4>
                      <ul className="list-disc list-inside mt-2">
                        {Object.keys(generatedCode).map(filename => (
                          <li key={filename}>{filename}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                {Object.entries(generatedCode).map(([filename, code]) => (
                  <TabsContent key={filename} value={filename}>
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => handleCopyCode(code, filename)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleDownloadAll} 
                variant="outline"
                className="flex gap-2"
              >
                <Download className="h-4 w-4" />
                Download All Files
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WebAppCreatorPage;
