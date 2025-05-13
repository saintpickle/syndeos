import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {Button} from "@/components/ui/button";
import {invoke} from "@tauri-apps/api/core";
import { useSettings } from "@/components/providers/settings"
import { useState } from "react"

export default function Advanced() {
    const { settings, updateSettings, isLoading, scategories } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label id="log-level">Log Level</Label>
                <Select 
                    aria-labeledby="log-level" 
                    disabled
                    value={settings['advanced/log_level'] || 'info'}
                >
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
            <div>
                <Label>Proxy Configuration</Label>
                Coming Soon!
            </div>
            <div>
                <Label>Custom Terminal Configuration</Label>
                Coming Soon!
            </div>
            <div>
                <Label>Custom Script Paths</Label>
                Coming Soon!
            </div>

            <div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className="space-y-2">
                            <Label>Delete All Application Data</Label>
                            <Button variant="destructive">Reset App</Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                local sqlite database, removing all stored servers settings, ssh keys, and local app settings and restart the application.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => invoke("reset_app")}
                            >Reset App</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                        <h3 className="font-medium mb-2">Current Advanced Settings:</h3>
                        {isLoading ? (
                            <p>Loading settings...</p>
                        ) : (
                            <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                {JSON.stringify(scategories.advanced, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
