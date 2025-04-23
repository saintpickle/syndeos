import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
    return (
        <Tabs defaultValue="connection" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="connection">Connection Settings</TabsTrigger>
                <TabsTrigger value="security">Security Settings</TabsTrigger>
                <TabsTrigger value="ui">UI Preferences</TabsTrigger>
                <TabsTrigger value="server">Server Management</TabsTrigger>
                <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="connection">
                <div className="my-3">
                    <Label htmlFor="ssh-connection-timeout">SSH Connection Timeout (s)</Label>
                    <Input id="ssh-connection-timeout" type="number" className="bg-white mt-2" />
                </div>
                <div className="my-3">
                    <Label id="connection-retry-attempts">Connection Retry Attempts</Label>
                    <Select aria-labeledby="connection-retry-attempts">
                        <SelectTrigger className="w-[180px] bg-white mt-2">
                            <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">max 5 attempts</SelectItem>
                            <SelectItem value="10">max 10 attempts</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="my-3">
                    <Label htmlFor="keep-alive-interval">Keep-Alive Interval (s)</Label>
                    <Input id="keep-alive-interval" type="number" className="bg-white mt-2" />
                </div>
            </TabsContent>
            <TabsContent value="security">
                <div className="my-3">
                    <Label htmlFor="store-ssh-key-passwords">Store SSH Key Passords (encrypted)</Label>
                    <Checkbox id="store-ssh-key-passwords" className="bg-white mt-2"></Checkbox>
                </div>
                <div className="my-3">
                    <Label id="auto-logout-timer">Auto-Logout Timer</Label>
                    <Select aria-labeledby="auto-logout-timer">
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
                <div className="my-3">
                    <Label>Password Complexity Requirements</Label>
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="require-uppercase" className="bg-white" />
                        <label
                            htmlFor="require-uppercase"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Require Uppercase
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <Checkbox id="require-numbers" className="bg-white" />
                        <label
                            htmlFor="require-numbers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Require Numbers
                        </label>
                    </div>
                </div>
                <div className="my-3">
                    <Label>Two-Factor Authenticaiton</Label>
                    Coming soon!
                </div>
            </TabsContent>
            <TabsContent value="ui">
                <div className="my-3">
                    <Label className="mb-3">Theme Selection</Label>
                    <RadioGroup defaultValue="light">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" className="bg-white" />
                            <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" className="bg-white" />
                            <Label htmlFor="dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" className="bg-white" />
                            <Label htmlFor="system">System</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="my-3">
                    <Label id="default-view">Default View</Label>
                    <Select aria-labeledby="default-view">
                        <SelectTrigger className="w-[180px] bg-white mt-2">
                            <SelectValue placeholder="Select a view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="servers">Servers</SelectItem>
                            <SelectItem value="ssh-keys">SSH Keys</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="my-3">
                    <Label className="mb-3">Table Display Density</Label>
                    <RadioGroup defaultValue="compact">
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
                <div className="my-3">
                    <Label id="date-format-preference">Date Format Preference</Label>
                    <Select aria-labeledby="date-format-preference">
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
            </TabsContent>
            <TabsContent value="server">
                <div className="my-3">
                    <Label id="auto-refresh-interval">Auto-Refresh Interval</Label>
                    <Select aria-labeledby="auto-refresh-interval">
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
                <div className="my-3">
                    <Label id="default-server-groups">Default Server Groups</Label>
                    <Select aria-labeledby="default-server-groups">
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
                <div className="my-3">
                    <Label id="health-check-frequency">Health Check Frequency</Label>
                    <Select aria-labeledby="health-check-frequency">
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
                <div className="my-5">
                    <Label>Notification Thresholds</Label>
                    <div className="my-3">
                        <Label htmlFor="cpu-usage-alert">CPU Usage Alert (%)</Label>
                        <Input id="cpu-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} />
                    </div>
                    <div className="my-3">
                        <Label htmlFor="memory-usage-alert">Memory Usage Alert (%)</Label>
                        <Input id="memory-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} />
                    </div>
                    <div className="my-3">
                        <Label htmlFor="disk-usage-alert">Disk Usage Alert (%)</Label>
                        <Input id="disk-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="backup">
                <div className="my-3">
                    <Label htmlFor="database-backup-location">Database Backup Location</Label>
                    <Input id="database-backup-location" className="bg-white mt-2" />
                </div>
                <div className="my-3">
                    <Label id="auto-backup-frequency">Auto-Backup Frequency</Label>
                    <Select aria-labeledby="auto-backup-frequency">
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
                <div className="flex items-center space-x-2 my-3">
                    <Checkbox id="encrypt-backups" className="bg-white" />
                    <label
                        htmlFor="encrypt-backups"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Encrypt Backups
                    </label>
                </div>
                <div className="my-3">
                    <Label htmlFor="encryption-password">Encryption Password</Label>
                    <Input id="encryption-password" type="password" className="bg-white mt-2" />
                </div>
            </TabsContent>
            <TabsContent value="advanced">
                <div className="my-3">
                    <Label id="log-level">Log Level</Label>
                    <Select aria-labeledby="log-level">
                        <SelectTrigger className="w-[180px] bg-white mt-2">
                            <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="debug">Debug</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warn">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="my-3">
                    <Label>Proxy Configuration</Label>
                    Coming Soon!
                </div>
                <div className="my-3">
                    <Label>Custom Terminal Configuration</Label>
                    Coming Soon!
                </div>
                <div className="my-3">
                    <Label>Custom Script Paths</Label>
                    Coming Soon!
                </div>
            </TabsContent>
        </Tabs>
    );
}