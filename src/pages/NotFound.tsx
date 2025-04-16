
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HayagrivaLogo from "@/components/HayagrivaLogo";
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/20">
      <HayagrivaLogo className="w-24 h-24 mb-8 animate-floating" />
      
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page not found</p>
      
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
        Hayagriva is still learning all paths, but can guide you back home.
      </p>
      
      <Button asChild className="flex items-center gap-2">
        <Link to="/">
          <Home className="w-4 h-4" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
