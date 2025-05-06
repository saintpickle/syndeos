import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  IconServer, 
  IconKey, 
  IconShieldCheck, 
  IconAlertCircle, 
  IconShieldExclamation,
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
import { 
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { invoke } from "@tauri-apps/api/core";
import {SshKey, SshKeys} from "@/types.ts";

export const serverFormSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  hostname: z.string().min(1, "Hostname is required"),
  ip_address: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  port: z.coerce.number()
    .int("Port must be an integer")
    .min(1, "Port must be at least 1")
    .max(65535, "Port must be at most 65535")
    .default(22),
  // Authentication options
  use_password: z.boolean().default(false),
  password: z.string().optional(),
  use_ssh_key: z.boolean().default(false),
  ssh_key: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  // At least one authentication method should be provided with its credentials
  if (data.use_password && !data.password) {
    return false;
  }
  if (data.use_ssh_key && !data.ssh_key) {
    return false;
  }
  // If no authentication is selected, that's also fine
  return true;
}, {
  message: "Please provide authentication details for the selected methods",
  path: ["use_password"], 
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;

type ServerFormProps = {
  mode?: "add" | "edit";
  initialData?: Partial<ServerFormValues>;
  onSubmit?: (data: ServerFormValues) => void;
  children?: React.ReactNode;
};

export function ServerForms({
  mode = "add",
  initialData = {},
  onSubmit,
  children,
}: ServerFormProps) {
  const [open, setOpen] = useState(false);
  const [sshKeys, setSshKeys] = useState<SshKeys>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [sshKeysError, setSshKeysError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine initial auth method states
  const hasInitialPassword = !!initialData.password;
  const hasInitialSshKey = !!initialData.ssh_key;

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      nickname: initialData.nickname || "",
      hostname: initialData.hostname || "",
      ip_address: initialData.ip_address || "",
      username: initialData.username || "",
      port: initialData.port || 22,
      use_password: initialData.use_password || hasInitialPassword || false,
      password: initialData.password || "",
      use_ssh_key: initialData.use_ssh_key || hasInitialSshKey || false,
      ssh_key: initialData.ssh_key || "",
    },
  });

  // Watch form values
  const usePassword = form.watch("use_password");
  const useSshKey = form.watch("use_ssh_key");

  useEffect(() => {
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
      if (onSubmit) {
        await onSubmit(data);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
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
            <IconServer className="mr-2 h-4 w-4" />
            {mode === "add" ? "Add Server" : "Edit Server"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <IconServer className="mr-2 h-5 w-5" />
            {mode === "add" ? "Add New Server" : "Edit Server"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Connect to a new server by providing the details below."
              : "Update your server connection details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Production Server" />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this server
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hostname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostname</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. root" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* IP Address field */}
              <FormField
                control={form.control}
                name="ip_address"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Port field */}
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3">Authentication Methods</h3>
              
              {/* Password Authentication Section */}
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="use_password"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center">
                          <IconShieldCheck className="mr-2 h-4 w-4" />
                          Password Authentication
                        </FormLabel>
                        <FormDescription>
                          Use password to authenticate with this server
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {usePassword && (
                  <div className="mt-2 pl-4 border-l-2 border-muted">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="new-password"
                              placeholder="Enter server password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              {/* SSH Key Authentication Section */}
              <div>
                <FormField
                  control={form.control}
                  name="use_ssh_key"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center">
                          <IconKey className="mr-2 h-4 w-4" />
                          SSH Key Authentication
                        </FormLabel>
                        <FormDescription>
                          Use an SSH key for secure authentication
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {useSshKey && (
                  <div className="mt-2 pl-4 border-l-2 border-muted">
                    <FormField
                      control={form.control}
                      name="ssh_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SSH Key</FormLabel>
                          <Select
                            disabled={loadingKeys}
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                {loadingKeys ? (
                                  <div className="flex items-center">
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading keys...</span>
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select an SSH key" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sshKeys.length === 0 && !loadingKeys ? (
                                <div className="p-2 text-sm text-muted-foreground">
                                  No SSH keys available. Please add a key first.
                                </div>
                              ) : (
                                sshKeys.map((key) => (
                                  <SelectItem key={key.id} value={String(key.id)}>
                                    <div className="flex items-center">
                                      <IconKey className="mr-2 h-4 w-4" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* SSH Key Disclaimer Note */}
                    <Alert variant="outline" className="mt-3 bg-muted/50">
                      <IconAlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs text-muted-foreground">
                        <strong>Important:</strong> If the SSH key is not already installed on the server, 
                        you will need to enable password authentication as well to complete the initial setup.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
              
              {/* Warning if no authentication method is selected */}
              {!usePassword && !useSshKey && (
                <div className="mt-3 flex items-center text-amber-500 text-sm">
                  <IconShieldExclamation className="mr-1 h-4 w-4" />
                  <span>No authentication method selected</span>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "add" ? "Add Server" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}