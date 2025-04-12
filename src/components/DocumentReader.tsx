
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Upload, File, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import VoiceAssistant from './VoiceAssistant';

const DocumentReader = () => {
  const [documents, setDocuments] = useState<{id: string, name: string, content: string}[]>([]);
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (file.type !== 'text/plain' && file.type !== 'application/pdf' && 
        !file.type.includes('word') && !file.type.includes('document')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text, PDF, or Word document.",
        variant: "destructive"
      });
      return;
    }
    
    // For demo purposes, we'll just handle text files
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newDoc = {
          id: Date.now().toString(),
          name: file.name,
          content
        };
        
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocument(newDoc.id);
        
        toast({
          title: "Document uploaded",
          description: `Successfully uploaded ${file.name}`,
        });
      };
      
      reader.readAsText(file);
    } else {
      // For demo purposes with other document types
      const mockContent = `This is a simulated content for ${file.name}. In a production environment, we would parse PDF/Word documents properly.`;
      
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        content: mockContent
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setActiveDocument(newDoc.id);
      
      toast({
        title: "Document uploaded",
        description: `Uploaded ${file.name} (note: only text preview is available in this demo)`,
      });
    }
  };
  
  const toggleReading = () => {
    setIsReading(!isReading);
  };
  
  const activeDocContent = documents.find(doc => doc.id === activeDocument)?.content || "";
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Document Reader</h2>
        <div className="flex items-center gap-2">
          <VoiceAssistant text={activeDocContent} />
          <Button variant="outline" onClick={() => document.getElementById('docUpload')?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input 
            type="file" 
            id="docUpload" 
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      {documents.length > 0 ? (
        <Tabs defaultValue={activeDocument || documents[0].id} onValueChange={setActiveDocument}>
          <TabsList className="w-full overflow-x-auto flex">
            {documents.map(doc => (
              <TabsTrigger key={doc.id} value={doc.id} className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {doc.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {documents.map(doc => (
            <TabsContent key={doc.id} value={doc.id} className="mt-4">
              <div className="bg-accent/30 p-4 rounded-md h-96 overflow-y-auto whitespace-pre-wrap">
                {doc.content}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <File className="h-16 w-16 mb-4" />
          <p>No documents uploaded yet.</p>
          <p className="text-sm">Upload a document to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentReader;
