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

export default function Advanced() {
    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label id="log-level">Log Level</Label>
                <Select aria-labeledby="log-level" disabled>
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
                        <Button variant="destructive">Reset App</Button>
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
        </div>
    )
}