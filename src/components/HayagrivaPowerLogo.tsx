
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
      <defs>
        <linearGradient id="powerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9A" /> {/* Pink */}
          <stop offset="50%" stopColor="#D946EF" /> {/* Purple */}
          <stop offset="100%" stopColor="#1EAEDB" /> {/* Blue */}
        </linearGradient>
      </defs>
      
      {/* Main body shape - stylized digital/cyber animal head */}
      <path
        d="M300 350
           L200 250
           L300 200
           L350 150
           L400 200
           L450 150
           L500 200
           L550 150
           L600 200
           L650 150
           L700 200
           L800 250
           L700 350
           L650 450
           L700 550
           L650 650
           L600 700
           L500 750
           L400 700
           L350 650
           L300 550
           L350 450
           L300 350Z"
        fill="white"
        stroke="url(#powerLogoGradient)"
        strokeWidth="25"
        strokeLinejoin="round"
      />
      
      {/* Left ear/horn */}
      <path
        d="M300 350
           L200 150
           L250 200
           L300 250"
        fill="url(#powerLogoGradient)"
        stroke="url(#powerLogoGradient)"
        strokeWidth="15"
        strokeLinejoin="round"
      />
      
      {/* Right ear/horn */}
      <path
        d="M700 350
           L800 150
           L750 200
           L700 250"
        fill="url(#powerLogoGradient)"
        stroke="url(#powerLogoGradient)"
        strokeWidth="15"
        strokeLinejoin="round"
      />
      
      {/* Lightning bolt left */}
      <path
        d="M350 650
           L250 750
           L300 700
           L275 800"
        fill="url(#powerLogoGradient)"
        stroke="url(#powerLogoGradient)"
        strokeWidth="15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      
      {/* Lightning bolt right */}
      <path
        d="M650 650
           L750 750
           L700 700
           L725 800"
        fill="url(#powerLogoGradient)"
        stroke="url(#powerLogoGradient)"
        strokeWidth="15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      
      {/* Eyes */}
      <circle cx="400" cy="450" r="30" fill="url(#powerLogoGradient)" />
      <circle cx="600" cy="450" r="30" fill="url(#powerLogoGradient)" />
      
      {/* Additional details for the cyber look */}
      <path
        d="M450 550
           L500 575
           L550 550"
        fill="none"
        stroke="url(#powerLogoGradient)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      {/* Glow effect */}
      <path
        d="M300 350
           L200 250
           L300 200
           L350 150
           L400 200
           L450 150
           L500 200
           L550 150
           L600 200
           L650 150
           L700 200
           L800 250
           L700 350
           L650 450
           L700 550
           L650 650
           L600 700
           L500 750
           L400 700
           L350 650
           L300 550
           L350 450
           L300 350Z"
        fill="none"
        stroke="url(#powerLogoGradient)"
        strokeWidth="5"
        strokeLinejoin="round"
        opacity="0.5"
        transform="scale(1.05) translate(-25, -25)"
      />
    </svg>
  );
};

export default HayagrivaPowerLogo;
