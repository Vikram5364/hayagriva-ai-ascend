
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
      
      {/* Horse head shape - stylized from the provided image */}
      <path 
        d="M500 150
           C400 150 325 200 300 300
           C275 400 290 450 325 500
           C360 550 370 600 350 650
           C330 700 300 750 325 800
           C350 850 425 825 500 800
           C575 825 650 850 675 800
           C700 750 670 700 650 650
           C630 600 640 550 675 500
           C710 450 725 400 700 300
           C675 200 600 150 500 150Z" 
        fill="url(#powerLogoGradient)"
        stroke="black"
        strokeWidth="10"
      />
      
      {/* Eyes */}
      <circle cx="425" cy="400" r="25" fill="white" />
      <circle cx="575" cy="400" r="25" fill="white" />
      <circle cx="425" cy="400" r="12" fill="black" />
      <circle cx="575" cy="400" r="12" fill="black" />
      
      {/* Mane/flame elements */}
      <path 
        d="M400 250
           C375 200 390 150 415 100
           C425 125 430 150 450 200
           
           M500 220
           C500 170 510 120 525 70
           C540 120 550 170 550 220
           
           M600 250
           C625 200 610 150 585 100
           C575 125 570 150 550 200"
        stroke="gold"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Nostril */}
      <path 
        d="M475 500
           C485 510 515 510 525 500"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Mouth line */}
      <path 
        d="M450 550
           C475 575 525 575 550 550"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Ears */}
      <path 
        d="M400 250
           C375 225 350 200 340 150
           C360 175 380 200 400 210"
        fill="#8B5CF6"
        stroke="black"
        strokeWidth="5"
      />
      
      <path 
        d="M600 250
           C625 225 650 200 660 150
           C640 175 620 200 600 210"
        fill="#8B5CF6"
        stroke="black"
        strokeWidth="5"
      />
    </svg>
  );
};

export default HayagrivaPowerLogo;
