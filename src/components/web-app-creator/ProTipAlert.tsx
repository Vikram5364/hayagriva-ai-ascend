
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProTipAlertProps {
  title?: string;
  description?: string;
}

const ProTipAlert: React.FC<ProTipAlertProps> = ({ 
  title = "Pro Tip", 
  description = "For optimal results, be as detailed as possible in your app description. Include specific features, design preferences, and functionality you want in your application."
}) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default ProTipAlert;
