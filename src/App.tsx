import {invoke} from "@tauri-apps/api/core";
import {useEffect} from "react";
import {SidebarProvider, SidebarInset} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import "./App.css";

function App() {
    useEffect(() => {
        invoke("init_app")
            .then(() => console.log("App initialized"))
            .catch((error) => console.log(error));
    }, []);

    return (
        <main>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-200">
                        {/* page provider here*/}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default App;
