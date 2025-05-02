import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function UI() {
    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label className="mb-3">Theme Selection</Label>
                <RadioGroup defaultValue="light" disabled>
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
            <div>
                <Label id="default-view">Default View</Label>
                <Select aria-labeledby="default-view" onValueChange={(value) => localStorage.setItem('default-view', value)} defaultValue={localStorage.getItem('default-view') ?? undefined}>
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="servers">Servers</SelectItem>
                        <SelectItem value="ssh-keys">SSH Keys</SelectItem>
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
                <Select aria-labeledby="date-format-preference" disabled>
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