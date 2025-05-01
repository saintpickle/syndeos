import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import MainContent from "@/components/main-content.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { PageProvider } from "@/components/providers/page.tsx";
import { ThemeProvider } from "@/components/theme-provider"

import "./App.css";

function App() {
    useEffect(() => {
        invoke("init_app")
            .then(() => console.log("App initialized"))
            .catch((error) => console.log(error));
    }, []);

    return (
        <main>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <PageProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <MainContent />
                    </SidebarProvider>
                </PageProvider>
            </ThemeProvider>
        </main>
    );
}

export default App;
