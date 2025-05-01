
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWebAppGenerator } from './WebAppGeneratorContext';

interface AdvancedSettingsProps {
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  showAdvanced,
  setShowAdvanced,
}) => {
  const { settings, updateSettings } = useWebAppGenerator();
  
  if (!showAdvanced) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Configure technical aspects of your app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="framework">Framework</Label>
          <Select value={settings.framework} onValueChange={(value) => updateSettings({ framework: value })}>
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="css-framework">CSS Framework</Label>
          <Select value={settings.cssFramework} onValueChange={(value) => updateSettings({ cssFramework: value })}>
            <SelectTrigger id="css-framework">
              <SelectValue placeholder="Select CSS framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">Tailwind CSS</SelectItem>
              <SelectItem value="bootstrap">Bootstrap</SelectItem>
              <SelectItem value="material">Material UI</SelectItem>
              <SelectItem value="chakra">Chakra UI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="responsive" 
            checked={settings.responsive}
            onCheckedChange={(checked) => updateSettings({ responsive: checked })}
          />
          <Label htmlFor="responsive">Responsive Design</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="accessibility" 
            checked={settings.accessibility}
            onCheckedChange={(checked) => updateSettings({ accessibility: checked })}
          />
          <Label htmlFor="accessibility">Accessibility Features</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSettings;
