import { Label } from "@/components/ui/label"
import {ThemeToggler} from "@/components/ui/theme-toggler.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/components/providers/settings"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function UI() {
    const { settings, updateSettings, isLoading } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    const handleSaveAllSettings = async () => {
        try {
            // Example of updating multiple settings at once
            await updateSettings({
                'ui/theme': 'system',
                'ui/default_view': 'servers',
                'ui/table_density': 'compact',
                'ui/date_format': 'MM/DD/YYYY'
            });
            alert('UI settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            alert('Failed to update settings');
        }
    };
    return (
        <div className="space-y-6 mt-6">
            <div className="space-y-3">
                <Label>Toggle Theme</Label>
                <ThemeToggler />
            </div>
            <div>
                <Label id="default-view">Default View</Label>
                <Select 
                    disabled
                    value={settings['ui/default_view'] || 'servers'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="servers">Servers</SelectItem>
                        <SelectItem value="ssh-keys">SSH Keys</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="mb-3">Table Display Density</Label>
                <RadioGroup 
                    value={settings['ui/table_density'] || 'compact'} 
                    disabled
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="compact" className="bg-white" />
                        <Label htmlFor="compact">Compact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="comfortable" className="bg-white" />
                        <Label htmlFor="comfortable">Comfortable</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <Label id="date-format-preference">Date Format Preference</Label>
                <Select 
                    disabled
                    value={settings['ui/date_format'] || 'MM/DD/YYYY'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3 pt-6 border-t">
                <Label>Settings Demo</Label>
                <div className="flex space-x-4">
                    <Button onClick={() => setShowSettings(!showSettings)}>
                        {showSettings ? 'Hide Settings' : 'Show Settings'}
                    </Button>
                    <Button onClick={handleSaveAllSettings}>
                        Save UI Settings
                    </Button>
                </div>

                {showSettings && (
                    <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                        <h3 className="font-medium mb-2">Current UI Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify({
                                    'ui/theme': settings['ui/theme'],
                                    'ui/default_view': settings['ui/default_view'],
                                    'ui/table_density': settings['ui/table_density'],
                                    'ui/date_format': settings['ui/date_format']
                                }, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
