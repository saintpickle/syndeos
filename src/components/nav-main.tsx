import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePageContext } from "@/components/providers/page";
import { ServerForms } from "@/components/features/server/forms.tsx";
import { invoke } from "@tauri-apps/api/core";

export function NavMain({items}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const {setCurrentPage} = usePageContext();

  const handleNavClick = (title: string) => {
    // Map nav titles to page keys
    const pageMap: Record<string, any> = {
      'Servers': 'servers',
      'SSH Keys': 'keys',
      'Settings': 'settings'
    };

    const pageKey = pageMap[title];
    if (pageKey) {
      setCurrentPage(pageKey);
    }
  };
  
  const handleAddServer = async (data: any) => {
    try {
      await invoke('add_server', { ...data });
      // You might want to refresh the servers list or show a notification
    } catch (error) {
      console.error('Failed to add server:', error);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <ServerForms 
              mode="add"
              onSubmit={handleAddServer}
            >
              <SidebarMenuButton
                tooltip="Add Server"
                className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled/>

                Add Server
              </SidebarMenuButton>
            </ServerForms>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="cursor-pointer"
                tooltip={item.title}
                onClick={() => handleNavClick(item.title)}
              >
                {item.icon && <item.icon/>}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}