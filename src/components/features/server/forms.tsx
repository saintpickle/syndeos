import * as React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    IconServer,
    IconKey,
    IconLoader2
} from "@tabler/icons-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {invoke} from "@tauri-apps/api/core";
import {SshKey, SshKeys} from "@/types.ts";
import {Textarea} from "@/components/ui/textarea";

// Define the schema with proper types
const serverFormSchema = z.object({
    name: z.string().min(1, "Server name is required"),
    hostname: z.string().min(1, "Hostname is required"),
    ip_address: z.string(),
    username: z.string().min(1, "Username is required"),
    port: z.coerce.number()
        .int("Port must be an integer")
        .min(1, "Port must be at least 1")
        .max(65535, "Port must be at most 65535"),
    ssh_key_id: z.union([z.number(), z.literal("__clear__")]).optional(),
    notes: z.string(),
    settings: z.string()
});

type ServerFormValues = z.infer<typeof serverFormSchema>;

type AddServerFormProps = {
    onSuccess?: () => void;
    children?: React.ReactNode;
};

export function AddServerForm({
                                  onSuccess,
                                  children,
                              }: AddServerFormProps) {
    const [open, setOpen] = useState(false);
    const [sshKeys, setSshKeys] = useState<SshKeys>([]);
    const [loadingKeys, setLoadingKeys] = useState(false);
    const [sshKeysError, setSshKeysError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ServerFormValues>({
        resolver: zodResolver(serverFormSchema),
        defaultValues: {
            name: "",
            hostname: "",
            ip_address: "",
            username: "",
            port: 22,
            notes: "",
            ssh_key_id: "__clear__",
            settings: "{}"
        },
    });

    React.useEffect(() => {
        if (open) {
            loadSshKeys();
        }
    }, [open]);

    const loadSshKeys = () => {
        setLoadingKeys(true);
        invoke<SshKey[]>("get_ssh_keys")
            .then(keys => {
                setSshKeys(keys);
                setSshKeysError(null);
            })
            .catch(e => {
                console.error("Failed to load SSH keys:", e);
                setSshKeysError(`Failed to load SSH keys: ${e}`);
            })
            .finally(() => setLoadingKeys(false));
    };

    const handleFormSubmit = async (data: ServerFormValues) => {
        try {
            setIsSubmitting(true);

            // Format the data to match the expected Server model on the backend
            const serverData = {
                name: data.name,
                hostname: data.hostname,
                ip_address: data.ip_address || "",
                port: data.port,
                username: data.username,
                ssh_key_id: data.ssh_key_id,
                notes: data.notes || "",
                settings: data.settings || "{}"
            };

            if (serverData.ssh_key_id === "__clear__") {
                serverData.ssh_key_id = undefined;
            }

            await invoke("add_server", {server: serverData});

            if (onSuccess) {
                onSuccess();
            }

            setOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error adding server:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            form.reset();
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline">
                        <IconServer className="mr-2 h-4 w-4"/>
                        Add Server
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <IconServer className="mr-2 h-5 w-5"/>
                        Add New Server
                    </DialogTitle>
                    <DialogDescription>
                        Connect to a new server by providing the details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Server Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Production Server"/>
                                    </FormControl>
                                    <FormDescription>
                                        A friendly name to identify this server
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="hostname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Hostname</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. example.com"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. root"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* IP Address field */}
                            <FormField
                                control={form.control}
                                name="ip_address"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>IP Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g. 192.168.1.100"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Optional static IP address
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Port field */}
                            <FormField
                                control={form.control}
                                name="port"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Port</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="22"
                                                min={1}
                                                max={65535}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            SSH port (default: 22)
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* SSH Key Selection */}
                        <FormField
                            control={form.control}
                            name="ssh_key_id"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>SSH Key</FormLabel>
                                    <Select
                                        disabled={loadingKeys}
                                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                                        value={field.value?.toString() || undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                {loadingKeys ? (
                                                    <div className="flex items-center">
                                                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                        <span>Loading keys...</span>
                                                    </div>
                                                ) : (
                                                    <SelectValue placeholder="Select an SSH key (optional)"/>
                                                )}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="__clear__">No SSH key</SelectItem>
                                            {sshKeys.length === 0 && !loadingKeys ? (
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    No SSH keys available
                                                </div>
                                            ) : (
                                                sshKeys.map((key) => (
                                                    <SelectItem key={key.id} value={String(key.id)}>
                                                        <div className="flex items-center">
                                                            <IconKey className="mr-2 h-4 w-4"/>
                                                            <span>{key.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {sshKeysError && (
                                        <div className="text-sm text-destructive mt-1">{sshKeysError}</div>
                                    )}
                                    <FormDescription>
                                        Select an SSH key for authentication (optional)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Notes field */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes about this server"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional notes or description for this server
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Add Server
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}