
import React from 'react';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/data/features';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-accent/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="gradient-text">Key Features</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
