import {
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Server} from '@/types';

interface ServerCardProps {
  server: Server;
  onViewDetails: (serverId: number) => void;
  onManageSettings: (serverId: number) => void;
  onConnect?: (serverId: number) => void;
  isConnected?: boolean;
}

export function ServerCard({ server, onViewDetails, onManageSettings, onConnect, isConnected = false }: ServerCardProps) {
  // Handle view details button click
  const handleViewDetails = () => {
    if (server.id) {
      onViewDetails(server.id);
    }
  };

  // Handle manage settings button click
  const handleManageSettings = () => {
    if (server.id) {
      onManageSettings(server.id);
    }
  };

  // Handle connect button click
  const handleConnect = () => {
    if (server.id && onConnect) {
      onConnect(server.id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          <CardTitle>{server.name}</CardTitle>
        </div>
        <CardDescription>
          {server.hostname} ({server.ip_address}) : {server.port}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Username:</span>
            <span className="text-sm">{server.username}</span>
          </div>
          {server.notes && (
            <div className="mt-4">
              <span className="text-sm font-medium">Notes:</span>
              <p className="text-sm mt-1 break-all bg-muted p-2 rounded-md">{server.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        {isConnected ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleManageSettings}
              className="flex-1 min-w-[120px] max-w-[200px]"
            >
              Manage
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewDetails}
              className="flex-1 min-w-[120px] max-w-[200px]"
            >
              View Analytics
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={handleConnect}
              className="flex-1 min-w-[120px] max-w-[200px]"
            >
              Connect
            </Button>
            <Button 
              variant="outline" 
              onClick={handleManageSettings}
              className="flex-1 min-w-[120px] max-w-[200px]"
            >
              Edit
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
