
import React from 'react';
import LearningPaths from '@/components/LearningPaths';

const LearningPathsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        <span className="gradient-text">Learning Paths</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Explore curated learning paths to master new skills with AI guidance
      </p>
      <LearningPaths />
    </div>
  );
};

export default LearningPathsPage;
