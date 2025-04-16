
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 bg-accent/30 border-t border-border">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hayagriva AI Ascend. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
