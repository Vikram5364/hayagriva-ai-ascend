import { cn } from "@/lib/utils";

interface HayagrivaLogoProps {
  className?: string;
}

const HayagrivaLogoHorseUpdate = ({ className }: HayagrivaLogoProps) => {
  return (
    <svg 
      className={cn("text-primary", className)}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle - keep the same */}
      <path 
        d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="url(#gradient)"
      />
      
      {/* Enhanced Horse Head Shape */}
      <path 
        d="M32 18C27 18 24 21 22 24C21 26 21 29 22 31C23 33 24 36 23 38C22 40 21 42 23 44C25 46 28 45 32 44C36 43 39 45 41 43C43 41 40 38 39 36C38 34 39 32 40 30C41 28 41 26 39 23C37 20 36 18 32 18Z"
        fill="currentColor"
      />
      
      {/* Horse Ears */}
      <path 
        d="M26 22C25 20 25 18 26 16C27 14 29 16 30 17"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M38 22C39 20 39 18 38 16C37 14 35 16 34 17"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      
      {/* Eyes */}
      <circle cx="29" cy="24" r="1" fill="gold" />
      <circle cx="35" cy="24" r="1" fill="gold" />
      
      {/* Mane */}
      <path 
        d="M32 14C32 14 30 16 30 18M32 14C32 14 34 16 34 18M32 14C34 14 36 13 37 12M32 14C30 14 28 13 27 12"
        stroke="gold" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      <defs>
        <linearGradient id="gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="gold" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HayagrivaLogoHorseUpdate;
