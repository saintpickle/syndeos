import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import MainContent from "@/components/main-content.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { PageProvider } from "@/components/providers/page.tsx";
import { ServerProvider } from "@/components/providers/server.tsx";
import { ThemeProvider } from "@/components/providers/theme.tsx";
import { SettingsProvider } from "@/components/providers/settings.tsx";
import "./App.css";

function App() {
    useEffect(() => {
        invoke("init_app")
            .then(() => console.log("App initialized"))
            .catch((error) => console.log(error));
    }, []);

    return (
        <SettingsProvider>
            <ThemeProvider>
                <PageProvider>
                    <ServerProvider>
                        <SidebarProvider>
                            <AppSidebar />
                            <MainContent />
                        </SidebarProvider>
                    </ServerProvider>
                </PageProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
}

export default App;
