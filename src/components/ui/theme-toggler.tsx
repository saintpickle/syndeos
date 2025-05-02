import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import { useTheme } from "@/components/providers/theme";

export function ThemeToggler() {
    const { theme, setTheme } = useTheme();

    let DefaultIcon = () => <IconDeviceDesktop className="size-5" />

    if (theme === "light") {
        DefaultIcon = () => <IconSun className="size-5" />
    }

    if (theme === "dark") {
        DefaultIcon = () => <IconMoon className="size-5" />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <DefaultIcon />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <IconSun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <IconMoon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <IconDeviceDesktop className="mr-2 h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}