import {invoke} from "@tauri-apps/api/core";
import {useState, useEffect} from "react";
import KeyCard from "@/components/cards/key.tsx";
import {SshKeys} from "@/types.ts";

export default function KeysPage() {
    const [keys, setKeys] = useState<SshKeys| undefined>();
    async function get_keys(){
        return await invoke<SshKeys>("get_ssh_keys");
    }

    useEffect(() => {
       get_keys()
           .then((data: SshKeys) => {
               if (!data) {
                   throw new Error("The list of keys is undefined.");
               }

               setKeys(data);
           })
           .catch((error) => console.log(error))
    }, []);

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            {keys?.map((key, idx) => {
                return (
                    <KeyCard key={idx} {...key} />
                )
            })}
        </div>
    );
}