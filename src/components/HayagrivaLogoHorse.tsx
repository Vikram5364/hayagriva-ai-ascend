import React from 'react';
import { cn } from "@/lib/utils";

interface HayagrivaLogoProps {
  className?: string;
}

const HayagrivaLogoHorse = ({ className }: HayagrivaLogoProps) => {
  return (
    <svg 
      className={cn("text-primary", className)}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle - same as the original logo */}
      <path 
        d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="url(#gradient)"
      />
      
      {/* Horse head shape */}
      <path 
        d="M32 20C28 20 25 22 24 24C23 26 23 30 24 32C25 34 27 35 26 37C25 39 23 40 24 42C25 44 29 42 32 42C35 42 39 44 40 42C41 40 39 39 38 37C37 35 39 34 40 32C41 30 41 26 40 24C39 22 36 20 32 20Z"
        fill="currentColor"
      />
      
      {/* Horse ear */}
      <path 
        d="M27 24C26 23 25 21 26 19C27 17 29 19 30 20"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      
      {/* Other ear */}
      <path 
        d="M37 24C38 23 39 21 38 19C37 17 35 19 34 20"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      
      {/* Eye */}
      <circle cx="29" cy="26" r="1" fill="currentColor" />
      
      {/* Other eye */}
      <circle cx="35" cy="26" r="1" fill="currentColor" />
      
      {/* Mane */}
      <path 
        d="M32 16C32 16 31 18 31 20M32 16C32 16 33 18 33 20M32 16C34 16 36 15 37 14M32 16C30 16 28 15 27 14"
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
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

export default HayagrivaLogoHorse;
