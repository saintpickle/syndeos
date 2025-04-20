import {invoke} from "@tauri-apps/api/core";
import {useState, useEffect} from "react";
import KeyCard from "@/components/cards/key.tsx";
import {SshKeys} from "@/types.ts";

export default function KeysPage() {
    const [keys, setKeys] = useState<SshKeys | undefined>();

    function get_keys() {
        invoke<SshKeys | undefined>("get_ssh_keys")
            .then((data) => {
                if (!data) {
                    throw new Error("The list of keys is undefined.");
                }

                setKeys(data);
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        get_keys();
    }, []);

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            {keys?.map((key, idx) => {
                return (
                    <KeyCard key={idx} sshKey={key} update_keys={get_keys}/>
                )
            })}
        </div>
    );
}