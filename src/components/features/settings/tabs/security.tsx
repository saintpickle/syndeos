import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Security() {
    return (
        <div className="space-y-6 mt-6">
            <div>
                <Label htmlFor="store-ssh-key-passwords">Store SSH Key Passords (encrypted)</Label>
                <Checkbox id="store-ssh-key-passwords" className="bg-white mt-2"></Checkbox>
            </div>
            <div>
                <Label id="auto-logout-timer">Auto-Logout Timer</Label>
                <Select aria-labeledby="auto-logout-timer">
                    <SelectTrigger className="w-[180px] bg-white mt-2">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="never">never</SelectItem>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Password Complexity Requirements</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox id="require-uppercase" className="bg-white" />
                    <label
                        htmlFor="require-uppercase"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Require Uppercase
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="require-numbers" className="bg-white" />
                    <label
                        htmlFor="require-numbers"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Require Numbers
                    </label>
                </div>
            </div>
            <div>
                <Label>Two-Factor Authenticaiton</Label>
                Coming soon!
            </div>
        </div>
    )
}