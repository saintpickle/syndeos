import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";

import {invoke} from "@tauri-apps/api/core";
import {SshKey} from "@/types.ts";
import {fdate} from "@/lib/utils.ts";

type Props = {
    sshKey: SshKey,
    update_keys: () => void;
};

export default function KeyCard({sshKey, update_keys}: Props) {
    function delete_key(id: number | undefined) {
        if (!id) {
            return;
        }

        invoke<string>("delete_ssh_key", {id: id, deleteFile: false})
            .then(data => {
                console.log(data);

                if (data) {
                    console.log("SshKey was successfully deleted.");
                } else {
                    console.log("SshKey could not be deleted.");
                }

                update_keys();
            })
            .catch(error => console.log(error));
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4">
                <CardTitle>{sshKey.name}</CardTitle>
                <Badge variant="secondary">{fdate(sshKey.created_at)}</Badge>
            </CardHeader>
            <CardContent>
                <p>Path: {sshKey.path}</p>
            </CardContent>
            <CardFooter>
                <Button variant="destructive" className="cursor-pointer" onClick={() => delete_key(sshKey.id)}>Delete</Button>
            </CardFooter>
        </Card>
    );
}