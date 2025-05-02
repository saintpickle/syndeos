import {SidebarInset} from "@/components/ui/sidebar.tsx";
import {PageRenderer, usePageContext} from "@/components/providers/page.tsx";

// Separate component to use the page context
export default function MainContent() {
    const { pageTitle } = usePageContext();

    return (
        <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-background">
                <h1 className="text-2xl font-semibold">{pageTitle}</h1>
                <PageRenderer />
            </div>
        </SidebarInset>
    );
}