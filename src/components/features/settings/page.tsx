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
            <TabsContent value="security">TODO 2</TabsContent>
            <TabsContent value="ui">TODO 3</TabsContent>
            <TabsContent value="server">TODO 4</TabsContent>
            <TabsContent value="backup">TODO 5</TabsContent>
            <TabsContent value="advanced">TODO 6</TabsContent>
        </Tabs>
    );
}