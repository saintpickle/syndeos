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
            <TabsContent value="server">TODO 4</TabsContent>
            <TabsContent value="backup">TODO 5</TabsContent>
            <TabsContent value="advanced">TODO 6</TabsContent>
        </Tabs>
    );
}