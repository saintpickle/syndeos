import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useSettings } from "@/components/providers/settings"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Backup() {
    const { settings, updateSettings, isLoading, scategories } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label htmlFor="database-backup-location">Database Backup Location</Label>
                <Input 
                    id="database-backup-location" 
                    className="bg-white mt-2" 
                    disabled 
                    value={settings['backup/location'] || '/path/to/backups'}
                />
            </div>
            <div>
                <Label id="auto-backup-frequency">Auto-Backup Frequency</Label>
                <Select 
                    aria-labeledby="auto-backup-frequency" 
                    disabled
                    value={settings['backup/frequency'] || 'never'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="1h">Every hour</SelectItem>
                        <SelectItem value="6h">Every 6 hours</SelectItem>
                        <SelectItem value="12h">Every 12 hours</SelectItem>
                        <SelectItem value="1d">Daily</SelectItem>
                        <SelectItem value="7d">Weekly</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="encrypt-backups" 
                    className="bg-white" 
                    disabled 
                    checked={settings['backup/encrypt'] === 'true'}
                />
                <label
                    htmlFor="encrypt-backups"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Encrypt Backups
                </label>
            </div>
            <div>
                <Label htmlFor="encryption-password">Encryption Password</Label>
                <Input 
                    id="encryption-password" 
                    type="password" 
                    className="bg-white mt-2" 
                    disabled 
                    value={settings['backup/encryption_password'] || ''}
                />
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
                        <h3 className="font-medium mb-2">Current Backup Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify(scategories.backup, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
