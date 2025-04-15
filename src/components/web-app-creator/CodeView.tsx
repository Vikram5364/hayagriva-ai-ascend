
import React, { RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";

interface CodeViewProps {
  generatedCode: string;
  codeRef: RefObject<HTMLPreElement>;
  handleCopyCode: () => void;
  handleDownloadCode: () => void;
  setActiveTab: (value: string) => void;
}

const CodeView: React.FC<CodeViewProps> = ({
  generatedCode,
  codeRef,
  handleCopyCode,
  handleDownloadCode,
  setActiveTab,
}) => {
  return (
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
  );
};

export default CodeView;
