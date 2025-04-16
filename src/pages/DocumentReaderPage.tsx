
import React from 'react';
import DocumentReader from '@/components/DocumentReader';

const DocumentReaderPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        <span className="gradient-text">Document Reader</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Upload and analyze documents with AI-powered insights and summaries
      </p>
      <DocumentReader />
    </div>
  );
};

export default DocumentReaderPage;
