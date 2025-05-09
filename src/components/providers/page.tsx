import React, { createContext, useContext, useState, useEffect } from 'react';
import ServersPage from '@/components/features/servers/page';
import ServerPage from '@/components/features/server/page';
import SettingsPage from '@/components/features/settings/page';
import KeysPage from '@/components/features/ssh-keys/page';
import { invoke } from '@tauri-apps/api/core';

// Define page types
type PageKey = 'servers' | 'server' | 'settings' | 'keys';

// Define page metadata type
interface PageMeta {
    component: React.ComponentType;
    title: string;
}

// Define pages mapping
const PAGES: Record<PageKey, PageMeta> = {
    servers: {
        component: ServersPage,
        title: 'Servers',
    },
    server: {
        component: ServerPage,
        title: 'Server',
    },
    keys: {
        component: KeysPage,
        title: 'SSH Keys',
    },
    settings: {
        component: SettingsPage,
        title: 'Settings',
    },
};

// Create context type
interface PageContextType {
    currentPage: PageKey;
    setCurrentPage: (page: PageKey) => void;
    pageTitle: string;
}

// Create context
const PageContext = createContext<PageContextType | undefined>(undefined);

// Provider component
export function PageProvider({ children }: { children: React.ReactNode }) {
    const [currentPage, setCurrentPage] = useState<PageKey>('servers'); // Default to 'servers'

    useEffect(() => {
        async function fetchDefaultPage() {
            try {
                const storedPage = await invoke<string>('get_setting', { key: 'default-view' });
                if (storedPage && PAGES[storedPage as PageKey]) {
                    setCurrentPage(storedPage as PageKey);
                }
            } catch (error) {
                console.error('Failed to fetch default page:', error);
            }
        }

        fetchDefaultPage();
    }, []);

    const pageTitle = PAGES[currentPage].title;

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage, pageTitle }}>
            {children}
        </PageContext.Provider>
    );
}

// Custom hook for using the page context
export function usePageContext() {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
}

// Component to render the current page
export function PageRenderer() {
    const { currentPage } = usePageContext();
    const PageComponent = PAGES[currentPage].component;

    return <PageComponent />;
}