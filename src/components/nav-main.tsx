import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePageContext } from "@/components/providers/page";

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

  return (
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                  tooltip="Add Server"
                  className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  onClick={() => console.log("Add server clicked")}
              >
                <IconCirclePlusFilled/>
                <span>Add Server</span>
              </SidebarMenuButton>
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