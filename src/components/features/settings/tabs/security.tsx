import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/components/providers/settings"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Security() {
    const { settings, updateSettings, isLoading, scategories } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label htmlFor="store-ssh-key-passwords">Store SSH Key Passords (encrypted)</Label>
                <Checkbox 
                    id="store-ssh-key-passwords" 
                    className="bg-white mt-2" 
                    disabled 
                    checked={settings['security/store_ssh_key_passwords'] === 'true'}
                />
            </div>
            <div>
                <Label id="auto-logout-timer">Auto-Logout Timer</Label>
                <Select 
                    aria-labeledby="auto-logout-timer" 
                    disabled
                    value={settings['security/auto_logout_timer'] || 'never'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="never">never</SelectItem>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Password Complexity Requirements</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="require-uppercase" 
                        className="bg-white" 
                        disabled 
                        checked={settings['security/require_uppercase'] === 'true'}
                    />
                    <label
                        htmlFor="require-uppercase"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Require Uppercase
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="require-numbers" 
                        className="bg-white" 
                        disabled 
                        checked={settings['security/require_numbers'] === 'true'}
                    />
                    <label
                        htmlFor="require-numbers"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Require Numbers
                    </label>
                </div>
            </div>
            <div>
                <Label>Two-Factor Authenticaiton</Label>
                Coming soon!
            </div>

            <div className="space-y-3 pt-6 border-t">
                <Label>Settings JSON</Label>
                <div className="flex space-x-4">
                    <Button onClick={() => setShowSettings(!showSettings)}>
                        {showSettings ? 'Hide Settings' : 'Show Settings'}
                    </Button>
                </div>

                {showSettings && (
                    <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                        <h3 className="font-medium mb-2">Current Security Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify(scategories.security, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
