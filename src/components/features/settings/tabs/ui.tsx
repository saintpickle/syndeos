import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"
import { ThemeToggler } from "@/components/ui/theme-toggler.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { invoke } from "@tauri-apps/api/core";

export default function UI() {
    const [defaultView, setDefaultView] = useState<string>("");

    async function get_default_view() {
        invoke<string>("get_setting", { key: "ui/default-view" })
            .then((value) => {
                setDefaultView(value);
            })
            .catch((error) => console.error("Failed to fetch default view:", error));
    }

    useEffect(() => {
        get_default_view().catch(err => console.log(err))
    }, []);

    return (
        <div className="space-y-6 mt-6">
            <div className="space-y-3">
                <Label>Toggle Theme</Label>
                <ThemeToggler />
            </div>
            <div>
                <Label id="default-view">Default View</Label>
                <Select
                    aria-labeledby="default-view"
                    value={defaultView} // Bind the selected value to the state, ensuring the dropdown reflects the current default view.
                    onValueChange={(value) => {
                        invoke("update_setting", { key: "ui/default-view", value })
                            .then(_ => get_default_view().catch(err => console.log(err)))
                            .catch((err) => console.log(err));
                    }}
                >
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="servers">Servers</SelectItem>
                        <SelectItem value="keys">SSH Keys</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="mb-3">Table Display Density</Label>
                <RadioGroup defaultValue="compact" disabled>
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
            <div>
                <Label id="date-format-preference">Date Format Preference</Label>
                <Select disabled>
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
        </div>
    )
}