import {invoke} from "@tauri-apps/api/core";
import {useEffect} from "react";

export default function KeysPage() {
    async function get_keys(){
        return await invoke("get_ssh_keys");
    }

    useEffect(() => {
       get_keys().then((data) => console.log(data));
    }, []);

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>SSH Key 1</p>
            </div>
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>SSH Key 2</p>
            </div>
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>SSH Key 3</p>
            </div>
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>SSH Key 4</p>
            </div>
        </div>
    );
}