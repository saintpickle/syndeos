import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
            <TabsContent value="connection">TODO 1</TabsContent>
            <TabsContent value="security">TODO 2</TabsContent>
            <TabsContent value="ui">TODO 3</TabsContent>
            <TabsContent value="server">TODO 4</TabsContent>
            <TabsContent value="backup">TODO 5</TabsContent>
            <TabsContent value="advanced">TODO 6</TabsContent>
        </Tabs>
    );
}