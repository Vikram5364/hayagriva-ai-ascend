
import { cn } from "@/lib/utils";

interface HayagrivaLogoProps {
  className?: string;
}

const HayagrivaLogo = ({ className }: HayagrivaLogoProps) => {
  return (
    <svg 
      className={cn("text-primary", className)}
      viewBox="0 0 1000 1000" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9A" /> {/* Pink */}
          <stop offset="50%" stopColor="#D946EF" /> {/* Purple */}
          <stop offset="100%" stopColor="#1EAEDB" /> {/* Blue */}
        </linearGradient>
      </defs>
      
      {/* Stylized horse/cybernetic rabbit logo based on the uploaded image */}
      <path
        d="M500 200
           C380 190 280 240 220 350
           C200 400 210 450 240 490
           C270 530 290 540 280 580
           C270 620 250 650 270 690
           C290 730 330 740 350 760
           C370 780 390 800 450 790
           C480 784 500 770 530 770
           C560 770 590 780 620 760
           C650 740 670 720 690 690
           C710 660 720 630 710 590
           C700 550 720 520 750 490
           C780 460 800 430 780 380
           C760 330 720 290 670 260
           C620 230 570 210 500 200Z"
        fill="white"
        stroke="url(#logoGradient)"
        strokeWidth="25"
      />
      
      {/* Left ear/flame */}
      <path
        d="M350 230
           C320 180 330 140 310 100
           C340 120 360 140 380 180
           C400 220 390 250 370 280"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="5"
      />
      
      {/* Right ear/flame */}
      <path
        d="M650 230
           C680 180 670 140 690 100
           C660 120 640 140 620 180
           C600 220 610 250 630 280"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="5"
      />
      
      {/* Lightning bolt left */}
      <path
        d="M250 550
           C230 600 210 650 240 700
           C260 680 270 660 280 640
           C290 620 300 600 310 580
           C320 560 330 540 300 520"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="5"
      />
      
      {/* Lightning bolt right */}
      <path
        d="M750 550
           C770 600 790 650 760 700
           C740 680 730 660 720 640
           C710 620 700 600 690 580
           C680 560 670 540 700 520"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="5"
      />
      
      {/* Eyes */}
      <circle cx="400" cy="450" r="20" fill="url(#logoGradient)" />
      <circle cx="600" cy="450" r="20" fill="url(#logoGradient)" />
    </svg>
  );
};

export default HayagrivaLogo;
