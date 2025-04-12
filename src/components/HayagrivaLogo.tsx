
import { cn } from "@/lib/utils";

interface HayagrivaLogoProps {
  className?: string;
}

const HayagrivaLogo = ({ className }: HayagrivaLogoProps) => {
  return (
    <svg 
      className={cn("text-primary", className)}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="url(#gradient)"
      />
      <path 
        d="M32 20C27.5817 20 24 23.5817 24 28C24 32.4183 27.5817 36 32 36C36.4183 36 40 39.5817 40 44" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M32 44C34.2091 44 36 42.2091 36 40C36 37.7909 34.2091 36 32 36C29.7909 36 28 37.7909 28 40C28 42.2091 29.7909 44 32 44Z" 
        fill="currentColor"
      />
      <path 
        d="M32 28C34.2091 28 36 26.2091 36 24C36 21.7909 34.2091 20 32 20C29.7909 20 28 21.7909 28 24C28 26.2091 29.7909 28 32 28Z" 
        fill="currentColor"
      />
      <defs>
        <linearGradient id="gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--secondary))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HayagrivaLogo;
