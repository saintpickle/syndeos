import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

export default function Connection() {
    const { settings, updateSettings, isLoading, scategories } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label htmlFor="ssh-connection-timeout">SSH Connection Timeout (s)</Label>
                <Input 
                    id="ssh-connection-timeout" 
                    type="number" 
                    className="bg-white mt-2" 
                    disabled 
                    value={settings['connection/ssh_timeout'] || '30'}
                />
            </div>
            <div>
                <Label id="connection-retry-attempts">Connection Retry Attempts</Label>
                <Select 
                    aria-labeledby="connection-retry-attempts" 
                    disabled
                    value={settings['connection/retry_attempts'] || '5'}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">max 5 attempts</SelectItem>
                        <SelectItem value="10">max 10 attempts</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="keep-alive-interval">Keep-Alive Interval (s)</Label>
                <Input 
                    id="keep-alive-interval" 
                    type="number" 
                    className="bg-white mt-2" 
                    disabled 
                    value={settings['connection/keep_alive_interval'] || '60'}
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
                        <h3 className="font-medium mb-2">Current Connection Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify(scategories.connection, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
