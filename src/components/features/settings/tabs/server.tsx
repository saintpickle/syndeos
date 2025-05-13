import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/components/providers/settings"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Server() {
    const { settings, updateSettings, isLoading, scategories } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label id="auto-refresh-interval">Auto-Refresh Interval</Label>
                <Select 
                    aria-labeledby="auto-refresh-interval" 
                    disabled
                    value={settings['server/auto_refresh_interval'] || '60'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">never</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label id="default-server-groups">Default Server Groups</Label>
                <Select 
                    aria-labeledby="default-server-groups" 
                    disabled
                    value={settings['server/default_groups'] || 'dev'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dev">dev</SelectItem>
                        <SelectItem value="prod">prod</SelectItem>
                        <SelectItem value="staging">staging</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label id="health-check-frequency">Health Check Frequency</Label>
                <Select 
                    aria-labeledby="health-check-frequency" 
                    disabled
                    value={settings['server/health_check_frequency'] || 'disable'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="disable">disable</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Notification Thresholds</Label>
                <div className="my-3">
                    <Label htmlFor="cpu-usage-alert">CPU Usage Alert (%)</Label>
                    <Input 
                        id="cpu-usage-alert" 
                        type="number" 
                        className="bg-white mt-2" 
                        value={settings['server/cpu_usage_alert'] || '90'} 
                        disabled 
                    />
                </div>
                <div className="my-3">
                    <Label htmlFor="memory-usage-alert">Memory Usage Alert (%)</Label>
                    <Input 
                        id="memory-usage-alert" 
                        type="number" 
                        className="bg-white mt-2" 
                        value={settings['server/memory_usage_alert'] || '90'} 
                        disabled 
                    />
                </div>
                <div className="my-3">
                    <Label htmlFor="disk-usage-alert">Disk Usage Alert (%)</Label>
                    <Input 
                        id="disk-usage-alert" 
                        type="number" 
                        className="bg-white mt-2" 
                        value={settings['server/disk_usage_alert'] || '90'} 
                        disabled 
                    />
                </div>
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
                        <h3 className="font-medium mb-2">Current Server Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify(scategories.server, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
