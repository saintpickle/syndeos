import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function Backup() {
    return (
        <div>
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
        </div>
    )
}