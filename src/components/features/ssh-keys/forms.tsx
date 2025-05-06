import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {invoke} from "@tauri-apps/api/core";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";

const generateKeySchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be less than 32 characters")
        .optional(),
    isDefault: z.boolean().optional()
});

const addKeySchema = z.object({
    name: z.string().min(1, "Name is required"),
    path: z.string().min(1, "Path is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be less than 32 characters")
        .optional(),
    isDefault: z.boolean().optional(),
});

type AddKeyFormProps = {
    onSuccess: () => void;
};

export function SshKeyForms({onSuccess}: AddKeyFormProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("generate");

    // Form for generating a new key
    const generateKeyForm = useForm<z.infer<typeof generateKeySchema>>({
        resolver: zodResolver(generateKeySchema),
        defaultValues: {
            name: "",
            isDefault: false
        },
    });

    // Form for adding an existing key
    const addKeyForm = useForm<z.infer<typeof addKeySchema>>({
        resolver: zodResolver(addKeySchema),
        defaultValues: {
            name: "",
            path: "",
            isDefault: false
        },
    });

    function onGenerateKeySubmit(values: z.infer<typeof generateKeySchema>) {
        // Add this check to block submission when form is invalid
        if (!generateKeyForm.formState.isValid) {
            // Trigger validation on all fields
            generateKeyForm.trigger();
            return;
        }

        invoke("generate_ssh_key", {
            name: values.name,
            password: values.password ?? ""
        })
            .then((keyPath) => {
                if (values.isDefault) {
                    // If the user wants this to be the default key, set it
                    invoke("get_ssh_keys")
                        .then((keys: any) => {
                            const newKey = keys.find((k: any) => k.path === keyPath);
                            if (newKey && newKey.id) {
                                invoke("set_default_ssh_key", {id: newKey.id})
                                    .catch(() => console.log("Error in setting key as the default."));
                            }
                        })
                        .catch(error => console.log(error));
                }
                setOpen(false);
                generateKeyForm.reset();
                onSuccess();
            })
            .catch((error) => console.log(error));
    }

    function onAddKeySubmit(values: z.infer<typeof addKeySchema>) {
        // Add this check to block submission when form is invalid
        if (!addKeyForm.formState.isValid) {
            // Trigger validation on all fields
            addKeyForm.trigger();
            return;
        }

        invoke("add_ssh_key", {
            name: values.name,
            path: values.path,
            password: values.password ?? "",
            isDefault: values.isDefault,
        })
            .then(() => {
                setOpen(false);
                addKeyForm.reset();
                onSuccess();
            })
            .catch((error) => console.log(error));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add SSH Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>Manage SSH Keys</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="generate">Generate New Key</TabsTrigger>
                        <TabsTrigger value="add">Add Existing Key</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generate">
                        <Form {...generateKeyForm}>
                            <form
                                onSubmit={generateKeyForm.handleSubmit(onGenerateKeySubmit)}
                                className="space-y-4 pt-4"
                            >
                                <FormField
                                    control={generateKeyForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="my_new_key" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                A name for the new SSH key
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={generateKeyForm.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="password123" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                SSH Key password (optional)
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={generateKeyForm.control}
                                    name="isDefault"
                                    render={({field}) => (
                                        <FormItem
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Set as default
                                                </FormLabel>
                                                <FormDescription>
                                                    Use this key by default for new server connections
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Generate Key</Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="add">
                        <Form {...addKeyForm}>
                            <form
                                onSubmit={addKeyForm.handleSubmit(onAddKeySubmit)}
                                className="space-y-4 pt-4"
                            >
                                <FormField
                                    control={addKeyForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="my_key" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                A name to identify this key
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addKeyForm.control}
                                    name="path"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Path</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/path/to/your/key" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Full path to the SSH key file
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={generateKeyForm.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="password123" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                SSH Key password (optional)
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addKeyForm.control}
                                    name="isDefault"
                                    render={({field}) => (
                                        <FormItem
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Set as default
                                                </FormLabel>
                                                <FormDescription>
                                                    Use this key by default for new server connections
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Add Key</Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
