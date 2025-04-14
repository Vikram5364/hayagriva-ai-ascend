
import { cn } from "@/lib/utils";

interface HayagrivaLogoProps {
  className?: string;
}

const HayagrivaPowerLogo = ({ className }: HayagrivaLogoProps) => {
  return (
    <svg 
      className={cn("text-primary", className)}
      viewBox="0 0 1000 1000" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background shape for gradient effect */}
      <defs>
        <linearGradient id="powerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b87f5" /> {/* Purple */}
          <stop offset="50%" stopColor="#8B5CF6" /> {/* Vivid Purple */}
          <stop offset="100%" stopColor="gold" /> {/* Gold */}
        </linearGradient>
      </defs>
      
      {/* Main shape - stylized from the uploaded image */}
      <path 
        d="M500 100
           C400 100 300 150 250 250
           L150 450
           C125 500 150 550 200 575
           L300 650
           C325 675 300 700 275 725
           L225 775
           C200 800 225 850 275 825
           L400 750
           C450 725 500 750 525 800
           L575 900
           C600 950 650 950 675 900
           L725 800
           C750 750 800 725 850 750
           L950 800
           C1000 825 1000 775 975 750
           L925 700
           C900 675 875 650 900 600
           L950 500
           C975 450 950 400 900 375
           L750 300
           C700 275 650 250 600 200
           L550 150
           C525 125 525 100 500 100
           Z" 
        fill="url(#powerLogoGradient)"
        stroke="black"
        strokeWidth="10"
      />
      
      {/* Inner details - abstract representation of the horse/flame concept */}
      <path 
        d="M500 300
           C475 325 450 350 425 400
           C400 450 425 500 475 525
           C525 550 575 525 600 475
           C625 425 600 375 550 350
           C525 325 500 325 500 300Z"
        fill="white"
      />
      
      {/* Lightning bolt accent */}
      <path 
        d="M350 600
           L400 500
           L350 525
           L375 450
           L325 475
           L350 400"
        stroke="white"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Flame crown accent */}
      <path 
        d="M650 400
           L675 300
           L700 350
           L725 275
           L750 350
           L775 300
           L800 400"
        stroke="white"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default HayagrivaPowerLogo;
