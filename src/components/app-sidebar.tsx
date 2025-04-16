import * as React from "react"
import {
    IconCloud,
    IconKey,
    IconBrandGithub,
    IconSettings,
} from "@tabler/icons-react"

import {NavMain} from "@/components/nav-main"
import {NavSecondary} from "@/components/nav-secondary"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Servers",
            url: "#",
            icon: IconCloud,
        },
        {
            title: "SSH Keys",
            url: "#",
            icon: IconKey,
        },
    ],
    navSecondary: [
        {
            title: "Github",
            url: "https://github.com/saintpickle/syndeos",
            icon: IconBrandGithub,
        },
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <img src="/icon.svg" alt="Syndeos Logo" className="size-12" />
                                <span className="text-base font-semibold">Syndeos</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
        </Sidebar>
    )
}
