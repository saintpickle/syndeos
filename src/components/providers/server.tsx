import React, { createContext, useContext, useState } from 'react';
import {Server} from "@/types";

interface ServerContextType {
  selectedServerId: number | null;
  setSelectedServerId: (id: number | null) => void;
  serverData: Server | null;
  setServerData: (server: Server | null) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [serverData, setServerData] = useState<Server | null>(null);

  return (
    <ServerContext.Provider 
      value={{ 
        selectedServerId, 
        setSelectedServerId, 
        serverData, 
        setServerData 
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext() {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServerContext must be used within a ServerProvider');
  }
  return context;
}