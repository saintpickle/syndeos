import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { invoke } from "@tauri-apps/api/core";
import { SshKey } from "@/types";
import { fdate } from "@/lib/utils";
import { ConfirmationModal } from "@/components/confirmation-modal";

type Props = {
    sshKey: SshKey;
    update_keys: () => void;
};

export default function SshKeyCard({ sshKey, update_keys }: Props) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    function delete_key(id: number | undefined) {
        if (!id) return;

        invoke<string>("delete_ssh_key", { id: id, deleteFile: true })
            .then(() => {
                update_keys();
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-2">
                        <CardTitle>{sshKey.name}</CardTitle>
                        {sshKey.is_default && (
                            <Badge variant="default">Default</Badge>
                        )}
                    </div>
                    <Badge variant="outline">{fdate(sshKey.created_at)}</Badge>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Path:</p>
                    <p className="text-sm break-all bg-muted p-2 rounded-md">{sshKey.path}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            invoke("set_default_ssh_key", { id: sshKey.id })
                                .then(() => update_keys())
                                .catch(error => console.log(error))
                        }}
                        disabled={sshKey.is_default}
                    >
                        {sshKey.is_default ? "Default Key" : "Set as Default"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </Button>
                </CardFooter>
            </Card>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={() => {
                    delete_key(sshKey.id);
                    setIsDeleteModalOpen(false);
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                title="Delete SSH Key"
                description={`Are you sure you want to delete "${sshKey.name}"? This action cannot be undone.`}
            />
        </>
    );
}