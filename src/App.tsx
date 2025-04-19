import {invoke} from "@tauri-apps/api/core";
import {useEffect} from "react";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import MainContent from "@/components/main-content.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import "./App.css";
import {PageProvider} from "@/components/providers/page.tsx";

function App() {
    useEffect(() => {
        invoke("init_app")
            .then(() => console.log("App initialized"))
            .catch((error) => console.log(error));
    }, []);

    return (
        <main>
            <PageProvider>
                <SidebarProvider>
                    <AppSidebar/>
                    <MainContent/>
                </SidebarProvider>
            </PageProvider>
        </main>
    );
}

export default App;
