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
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                                <p>Server 1</p>
                            </div>
                            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                                <p>Server 2</p>
                            </div>
                            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                                <p>Server 3</p>
                            </div>
                            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                                <p>Server 4</p>
                            </div>
                            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                                <p>Server 5</p>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default App;
