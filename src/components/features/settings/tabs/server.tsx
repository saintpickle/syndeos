import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function Server() {
    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label id="auto-refresh-interval">Auto-Refresh Interval</Label>
                <Select aria-labeledby="auto-refresh-interval" disabled>
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">never</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label id="default-server-groups">Default Server Groups</Label>
                <Select aria-labeledby="default-server-groups" disabled>
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dev">dev</SelectItem>
                        <SelectItem value="prod">prod</SelectItem>
                        <SelectItem value="staging">staging</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label id="health-check-frequency">Health Check Frequency</Label>
                <Select aria-labeledby="health-check-frequency" disabled>
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="disable">disable</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Notification Thresholds</Label>
                <div className="my-3">
                    <Label htmlFor="cpu-usage-alert">CPU Usage Alert (%)</Label>
                    <Input id="cpu-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} disabled />
                </div>
                <div className="my-3">
                    <Label htmlFor="memory-usage-alert">Memory Usage Alert (%)</Label>
                    <Input id="memory-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} disabled />
                </div>
                <div className="my-3">
                    <Label htmlFor="disk-usage-alert">Disk Usage Alert (%)</Label>
                    <Input id="disk-usage-alert" type="number" className="bg-white mt-2" defaultValue={90} disabled />
                </div>
            </div>
        </div>
    )
}