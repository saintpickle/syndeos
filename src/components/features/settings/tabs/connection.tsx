import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Connection() {
    return (
        <div>
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
        </div>
    )
}