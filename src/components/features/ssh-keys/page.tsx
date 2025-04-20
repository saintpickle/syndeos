import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import SshKeyCard from "@/components/features/ssh-keys/card";
import { SshKeyForms } from "@/components/features/ssh-keys/forms";
import { SshKeys } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { IconKey } from "@tabler/icons-react";

export default function KeysPage() {
    const [keys, setKeys] = useState<SshKeys>([]);
    const [loading, setLoading] = useState(true);

    function get_keys() {
        setLoading(true);
        invoke<SshKeys>("get_ssh_keys")
            .then((data) => {
                setKeys(data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        get_keys();
    }, []);

    return (
        <div className="space-y-6">
            <SshKeyForms onSuccess={get_keys} />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-40 flex items-center justify-center">
                                <div className="w-full h-full bg-muted rounded-md"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : keys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {keys.map((key) => (
                        <SshKeyCard key={key.id} sshKey={key} update_keys={get_keys} />
                    ))}
                </div>
            ) : (
                <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <IconKey size={48} className="text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No SSH Keys Found</h3>
                        <p className="text-muted-foreground text-center mt-2 max-w-md">
                            Add or generate SSH keys to securely connect to your servers without using passwords.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
