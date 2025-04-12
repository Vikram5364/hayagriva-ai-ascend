
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Code, Copy, Play, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CodeGenerationPage = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const { toast } = useToast();
  
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for the code you want to generate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate code generation
    setTimeout(() => {
      const sampleCodes = {
        javascript: `function calculateSum(arr) {
  return arr.reduce((sum, current) => sum + current, 0);
}

// Example usage
const numbers = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers)); // Output: 15`,
        typescript: `function calculateSum(arr: number[]): number {
  return arr.reduce((sum, current) => sum + current, 0);
}

// Example usage
const numbers: number[] = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers)); // Output: 15`,
        python: `def calculate_sum(arr):
    return sum(arr)

# Example usage
numbers = [1, 2, 3, 4, 5]
print(calculate_sum(numbers))  # Output: 15`,
      };
      
      setGeneratedCode(sampleCodes[selectedLanguage] || sampleCodes.javascript);
      setIsGenerating(false);
      
      toast({
        title: "Code generated successfully",
        description: "You can now edit or copy the generated code.",
      });
    }, 1500);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste the code wherever you need it.",
    });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">AI Code Generation</span> & Editing
        </h1>
        <p className="text-muted-foreground">
          Generate and edit code with the power of AI. Describe what you need, and let Hayagriva create the code for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Code Prompt
            </CardTitle>
            <CardDescription>
              Describe the code you want to generate in detail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., Write a function that calculates the sum of all elements in an array"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-40 mb-4"
            />
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Programming Language</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <Badge 
                    key={lang.value}
                    variant={selectedLanguage === lang.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedLanguage(lang.value)}
                  >
                    {lang.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating} 
              className="w-full"
            >
              {isGenerating ? (
                <>Generating<span className="loading loading-dots"></span></>
              ) : (
                <>Generate Code <Wand2 className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5 text-primary" />
              Generated Code
            </CardTitle>
            <CardDescription>
              Edit or copy the generated code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="relative">
                <Textarea
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  className="min-h-40 mb-4 font-mono text-sm bg-muted/50"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="min-h-40 flex flex-col items-center justify-center text-muted-foreground">
                <Code className="h-16 w-16 mb-2 opacity-25" />
                <p>Generated code will appear here</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedCode("")} disabled={!generatedCode}>
              Clear
            </Button>
            <Button variant="outline" disabled={!generatedCode}>
              <Play className="mr-2 h-4 w-4" /> Run Code
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Tips for Better Code Generation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Do's
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  <span>Be specific about inputs, outputs, and edge cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  <span>Specify error handling requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  <span>Mention performance considerations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  <span>Include example input/output pairs</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                  <span>Use vague descriptions</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                  <span>Request code for harmful purposes</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                  <span>Forget to specify the programming language</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                  <span>Ignore security considerations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationPage;
