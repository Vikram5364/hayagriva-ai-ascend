
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProTipAlert: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Pro Tip</AlertTitle>
      <AlertDescription>
        For better results, be detailed in your app description. Include features, design preferences, and functionality.
      </AlertDescription>
    </Alert>
  );
};

export default ProTipAlert;
