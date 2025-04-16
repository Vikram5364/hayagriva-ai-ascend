
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, FileText, Loader2, Upload, BookOpen, Brain, Share2, Download } from "lucide-react";
import HayagrivaPowerLogo from "@/components/HayagrivaPowerLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResearchPaperPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [paperText, setPaperText] = useState("");
  const [analysis, setAnalysis] = useState<{
    summary: string;
    keyPoints: string[];
    methodology: string;
    findings: string;
    limitations: string;
    simplifiedExplanation: string;
  } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPaperText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (file.type !== 'application/pdf' && 
        file.type !== 'text/plain' &&
        !file.name.endsWith('.pdf') &&
        !file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or text file containing the research paper.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
    
    // For text files, read the content
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPaperText(content);
      };
      reader.readAsText(file);
    } else {
      // For PDFs, we would integrate with a PDF parsing library in production
      // For this demo, we'll just acknowledge the file and provide a placeholder
      toast({
        title: "PDF uploaded",
        description: `"${file.name}" has been uploaded. In this demo, PDF text extraction is simulated.`,
      });
      
      // Simulate extracting some text from the PDF
      setTimeout(() => {
        setPaperText(`[PDF Content extracted from ${file.name}]

This is a simulated research paper content. In a production environment, 
the actual text would be extracted from the PDF file.

Abstract:
The field of artificial intelligence has seen significant advancements in recent years,
particularly in the area of natural language processing. This paper explores the 
implications of these advancements for academic research and information synthesis.

Introduction:
Natural Language Processing (NLP) has evolved rapidly with the development of transformer
models and large language models (LLMs). These technologies have demonstrated remarkable
capabilities in understanding and generating human-like text...

[Continued paper content would appear here]`);
      }, 1500);
    }
    
    setActiveTab("analyze");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeResearchPaper = () => {
    if (!paperText.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please upload a research paper or paste its content first.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate AI analysis process
    setTimeout(() => {
      const sampleAnalysis = {
        summary: "This paper presents advances in natural language processing using transformer-based models, demonstrating significant improvements in text understanding and generation capabilities. The research evaluates these models across multiple benchmarks and proposes a new architecture that enhances performance while reducing computational requirements.",
        keyPoints: [
          "Novel transformer architecture with 30% fewer parameters",
          "Improved performance on GLUE benchmark by 3.2%",
          "Reduced training time by implementing sparse attention mechanisms",
          "Demonstrated better generalization to low-resource languages",
          "Ethical considerations for deployment of large language models"
        ],
        methodology: "The researchers employed a comparative analysis methodology, evaluating their proposed model against leading alternatives using standardized benchmarks. They controlled for computational resources and training data to ensure fair comparison.",
        findings: "The study found that their proposed architecture outperforms existing models while using fewer computational resources. The key innovation—sparse attention mechanisms—proved particularly effective for handling longer document contexts.",
        limitations: "The research acknowledges limitations in multilingual capabilities and domain-specific applications. The authors note that performance degrades when applied to specialized scientific domains without additional fine-tuning.",
        simplifiedExplanation: "This paper shows how to make AI language models better at understanding text while using less computing power. The researchers created a new design that's more efficient and works better than previous models. Their biggest innovation is a technique that allows the AI to focus only on important parts of text, rather than processing everything equally. This makes the AI both faster and better at understanding long documents. While it works really well for common tasks, it still struggles with very specialized topics and some languages without extra training."
      };
      
      setAnalysis(sampleAnalysis);
      setLoading(false);
      setActiveTab("results");
      
      toast({
        title: "Analysis complete",
        description: "The research paper has been analyzed successfully.",
      });
    }, 3000);
  };

  const downloadAnalysis = () => {
    if (!analysis) return;
    
    const analysisText = `
# Research Paper Analysis

## Summary
${analysis.summary}

## Key Points
${analysis.keyPoints.map(point => `- ${point}`).join('\n')}

## Methodology
${analysis.methodology}

## Findings
${analysis.findings}

## Limitations
${analysis.limitations}

## Simplified Explanation
${analysis.simplifiedExplanation}

---
Generated by Hayagriva Research AI
    `.trim();
    
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paper-analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis downloaded",
      description: "Your research paper analysis has been downloaded as a markdown file.",
    });
  };

  const shareAnalysis = () => {
    if (!analysis) return;
    
    // In a real app, this would open a modal with sharing options
    // For this demo, we'll simulate copying a shareable link
    navigator.clipboard.writeText(`https://hayagriva.ai/shared-analysis/${Date.now()}`);
    
    toast({
      title: "Share link copied",
      description: "A link to this analysis has been copied to your clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HayagrivaPowerLogo className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Research Paper Analyzer</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Research Paper</CardTitle>
                  <CardDescription>
                    Upload a research paper in PDF or text format for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary transition-colors" onClick={handleUploadClick}>
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground mb-1">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                      Supports PDF and TXT formats
                    </p>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".pdf,.txt"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    onClick={() => setActiveTab("analyze")}
                  >
                    <Upload className="h-4 w-4" />
                    Paste paper content manually
                  </Button>
                </CardContent>
                <CardFooter>
                  {uploadedFile && (
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertTitle>File uploaded</AlertTitle>
                      <AlertDescription>
                        "{uploadedFile.name}" has been uploaded successfully.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>How it works</AlertTitle>
                <AlertDescription>
                  Upload your research paper and our AI will analyze it to provide a concise summary, key points, and a simplified explanation. Perfect for quickly understanding complex research.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="analyze" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Research Paper Content</CardTitle>
                  <CardDescription>
                    {uploadedFile ? `Content from "${uploadedFile.name}"` : "Paste or edit the research paper content"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="paper-content">Paper Content</Label>
                    <Textarea 
                      id="paper-content"
                      placeholder="Paste the content of the research paper here..."
                      value={paperText}
                      onChange={handleTextChange}
                      className="min-h-[300px] font-mono text-sm resize-y"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={analyzeResearchPaper}
                    disabled={loading || !paperText.trim()}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Analyze Paper
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              {analysis ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Paper Analysis Results</CardTitle>
                    <CardDescription>
                      AI-generated analysis of the research paper
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-muted-foreground">{analysis.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Points</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.keyPoints.map((point, index) => (
                          <li key={index} className="text-muted-foreground">{point}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Methodology</h3>
                      <p className="text-muted-foreground">{analysis.methodology}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Findings</h3>
                      <p className="text-muted-foreground">{analysis.findings}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Limitations</h3>
                      <p className="text-muted-foreground">{analysis.limitations}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Simplified Explanation</h3>
                      <p>{analysis.simplifiedExplanation}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("analyze")} className="gap-2">
                      <FileText className="h-4 w-4" />
                      Edit Paper
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={shareAnalysis} className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button onClick={downloadAnalysis} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-2">
                    No analysis results yet
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("analyze")}
                  >
                    Analyze a paper first
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Research Paper Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our AI-powered research paper analyzer helps you quickly understand complex academic papers by:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline">1</Badge>
                  <p className="text-sm">Summarizing the paper's key points and contributions</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline">2</Badge>
                  <p className="text-sm">Breaking down complex methodologies and findings</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline">3</Badge>
                  <p className="text-sm">Providing a simplified explanation for non-experts</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline">4</Badge>
                  <p className="text-sm">Identifying limitations and areas for future research</p>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>AI Analysis</AlertTitle>
                <AlertDescription>
                  Our analysis uses advanced language models to comprehend academic content, but always double-check important information with the original paper.
                </AlertDescription>
              </Alert>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Supported Research Fields</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Computer Science</Badge>
                  <Badge>Medicine</Badge>
                  <Badge>Physics</Badge>
                  <Badge>Economics</Badge>
                  <Badge>Psychology</Badge>
                  <Badge>Engineering</Badge>
                  <Badge>Biology</Badge>
                  <Badge variant="outline">And more...</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperPage;
