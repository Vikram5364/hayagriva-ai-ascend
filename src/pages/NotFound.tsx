
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HayagrivaLogo from "@/components/HayagrivaLogo";

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
      
      <Button asChild>
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
