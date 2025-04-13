import {SidebarProvider, SidebarInset} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import "./App.css";

function App() {
    return (
        <main>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-200">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                            <div className="aspect-video rounded-xl bg-primary"/>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default App;
