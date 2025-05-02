import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Connection from "./tabs/connection";
import Security from "./tabs/security";
import UI from "./tabs/ui";
import Server from "./tabs/server";
import Backup from "./tabs/backup";
import Advanced from "./tabs/advanced";

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
                <Connection />
            </TabsContent>
            <TabsContent value="security">
                <Security />
            </TabsContent>
            <TabsContent value="ui">
                <UI />
            </TabsContent>
            <TabsContent value="server">
                <Server />
            </TabsContent>
            <TabsContent value="backup">
                <Backup />
            </TabsContent>
            <TabsContent value="advanced">
                <Advanced />
            </TabsContent>
        </Tabs>
    );
}