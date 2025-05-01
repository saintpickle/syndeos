import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
        </div>
    )
}