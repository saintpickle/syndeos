import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useServerContext } from '@/components/providers/server';
import { usePageContext } from '@/components/providers/page';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ServerPage() {
    const { selectedServerId, serverData } = useServerContext();
    const { setCurrentPage } = usePageContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedServerId && !serverData) {
            setCurrentPage('servers');
        }
    }, [selectedServerId, serverData, setCurrentPage]);

    const handleBackToServers = () => {
        setCurrentPage('servers');
    };

    if (!serverData) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-4">
                <p>No server selected or server data not available.</p>
                <Button onClick={handleBackToServers}>Back to Servers</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{serverData.name}</h2>
                <Button variant="outline" onClick={handleBackToServers}>
                    Back to Servers
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Server Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Hostname:</span>
                            <span>{serverData.hostname}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">IP Address:</span>
                            <span>{serverData.ip_address}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Port:</span>
                            <span>{serverData.port}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Username:</span>
                            <span>{serverData.username}</span>
                        </div>
                        {serverData.notes && (
                            <div className="mt-4">
                                <span className="font-medium">Notes:</span>
                                <p className="mt-1">{serverData.notes}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                    <p>Server Analytics 1</p>
                </div>
                <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                    <p>Server Analytics 2</p>
                </div>
                <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                    <p>Server Analytics 3</p>
                </div>
            </div>
        </div>
    );
}
