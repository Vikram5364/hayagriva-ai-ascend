
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: `${delay}s` }}>
      <CardHeader className="pb-2">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
    </Card>
  );
};

export default FeatureCard;
