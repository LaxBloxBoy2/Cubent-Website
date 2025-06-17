'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface SettingsFormProps {
  userId: string;
  extensionSettings: Record<string, any>;
  preferences: Record<string, any>;
}

export function SettingsForm({ 
  userId, 
  extensionSettings, 
  preferences 
}: SettingsFormProps) {
  const [settings, setSettings] = useState({
    // Extension Settings
    defaultModel: extensionSettings.defaultModel || 'claude-3-sonnet',
    autoSave: extensionSettings.autoSave ?? true,
    codeCompletion: extensionSettings.codeCompletion ?? true,
    maxTokens: extensionSettings.maxTokens || 4000,
    temperature: extensionSettings.temperature || 0.7,
    customPrompt: extensionSettings.customPrompt || '',
    
    // User Preferences
    theme: preferences.theme || 'system',
    notifications: preferences.notifications ?? true,
    analytics: preferences.analytics ?? true,
    autoConnect: preferences.autoConnect ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const extensionSettingsToSave = {
        defaultModel: settings.defaultModel,
        autoSave: settings.autoSave,
        codeCompletion: settings.codeCompletion,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
        customPrompt: settings.customPrompt,
      };

      const preferencesToSave = {
        theme: settings.theme,
        notifications: settings.notifications,
        analytics: settings.analytics,
        autoConnect: settings.autoConnect,
      };

      const response = await fetch('/api/extension/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extensionSettings: extensionSettingsToSave,
          preferences: preferencesToSave,
        }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Model Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold">AI Model Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="defaultModel">Default Model</Label>
          <Select
            value={settings.defaultModel}
            onValueChange={(value) => handleSettingChange('defaultModel', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              min="100"
              max="8000"
              value={settings.maxTokens}
              onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customPrompt">Custom System Prompt</Label>
          <Textarea
            id="customPrompt"
            placeholder="Enter a custom system prompt for the AI..."
            value={settings.customPrompt}
            onChange={(e) => handleSettingChange('customPrompt', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Extension Behavior */}
      <div className="space-y-4">
        <h3 className="font-semibold">Extension Behavior</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes to files
            </p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Code Completion</Label>
            <p className="text-sm text-muted-foreground">
              Enable AI-powered code completion
            </p>
          </div>
          <Switch
            checked={settings.codeCompletion}
            onCheckedChange={(checked) => handleSettingChange('codeCompletion', checked)}
          />
        </div>
      </div>

      {/* User Preferences */}
      <div className="space-y-4">
        <h3 className="font-semibold">User Preferences</h3>
        
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => handleSettingChange('theme', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about updates and usage
            </p>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Usage Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Allow collection of usage data for analytics
            </p>
          </div>
          <Switch
            checked={settings.analytics}
            onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Connect</Label>
            <p className="text-sm text-muted-foreground">
              Automatically connect extension when VS Code starts
            </p>
          </div>
          <Switch
            checked={settings.autoConnect}
            onCheckedChange={(checked) => handleSettingChange('autoConnect', checked)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
