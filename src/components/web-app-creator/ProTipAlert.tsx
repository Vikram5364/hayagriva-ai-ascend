
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProTipAlert: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Pro Tip</AlertTitle>
      <AlertDescription>
        For optimal results, be as detailed as possible in your app description. Include specific features, design preferences, and functionality you want in your application.
      </AlertDescription>
    </Alert>
  );
};

export default ProTipAlert;
