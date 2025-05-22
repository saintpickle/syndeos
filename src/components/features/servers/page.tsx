import { usePageContext } from '@/components/providers/page';
import { useServerContext } from '@/components/providers/server';
import { useGlobalState } from '@/components/providers/global-state.tsx';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, EyeIcon, EyeOffIcon } from "lucide-react";

export default function ServersPage(){
    const { servers, setServers, loading, error, visibleIpMap, toggleIpVisibility } = useGlobalState();
    const { setCurrentPage } = usePageContext();
    const { setSelectedServerId, setServerData } = useServerContext();

    const handleViewDetails = (serverId: number) => {
        const server = servers.find(s => s.id === serverId) || null;

        if (server) {
            setSelectedServerId(serverId);
            setServerData(server);
            setCurrentPage('server');
        }
    };

    const handleManageSettings = (serverId: number) => {
        const server = servers.find(s => s.id === serverId) || null;

        if (server) {
            setSelectedServerId(serverId);
            setServerData(server);
            setCurrentPage('server');
        }
    };

    const handleConnect = (serverId: number) => {
        // This is a placeholder for the connect functionality
        console.log(`Connecting to server with ID: ${serverId}`);
    };

    const handleDelete = async (serverId: number) => {
        if (!window.confirm("Are you sure you want to delete this server?")) {
            return;
        }

        try {
            // This is a placeholder for the delete functionality
            // In a real implementation, this would call the backend to delete the server
            console.log(`Deleting server with ID: ${serverId}`);
            // await invoke('delete_server', { id: serverId });

            // Update the local state to remove the deleted server
            setServers(servers.filter(s => s.id !== serverId));
        } catch (err) {
            console.error('Failed to delete server:', err);
            alert('Failed to delete server. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading servers...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    if (servers.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-4">
                <p>No servers found. Add a server to get started.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4">
            <Table>
                <TableHeader className="bg-accent text-accent-foreground">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Hostname</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Port</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {servers.map((server) => (
                        <TableRow key={server.id}>
                            <TableCell className="font-medium">{server.name}</TableCell>
                            <TableCell>{server.hostname}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span>{server.ip_address ? (visibleIpMap[server.id || 0] ? server.ip_address : '••••••••••') : 'N/A'}</span>
                                    {server.ip_address && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                server.id && toggleIpVisibility(server.id);
                                            }}
                                            title={visibleIpMap[server.id || 0] ? "Hide IP Address" : "Show IP Address"}
                                        >
                                            {visibleIpMap[server.id || 0] ?
                                                <EyeOffIcon className="h-3 w-3" /> :
                                                <EyeIcon className="h-3 w-3" />
                                            }
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{server.port}</TableCell>
                            <TableCell>{server.username}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => server.id && handleConnect(server.id)}
                                    >
                                        Connect
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                                onClick={() => server.id && handleManageSettings(server.id)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => server.id && handleDelete(server.id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
