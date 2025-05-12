import React, { createContext, useContext, useState, useEffect } from 'react';
import ServersPage from '@/components/features/servers/page';
import ServerPage from '@/components/features/server/page';
import SettingsPage from '@/components/features/settings/page';
import KeysPage from '@/components/features/ssh-keys/page';
import { useSettings } from "@/components/providers/settings.tsx";

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

interface PageContextType {
    currentPage: PageKey;
    setCurrentPage: (page: PageKey) => void;
    pageTitle: string;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings();
    const DEFAULT_VIEW = settings['ui/default_view'] as PageKey;

    const [currentPage, setCurrentPage] = useState<PageKey>(() => DEFAULT_VIEW || 'servers');
    const pageTitle = PAGES[currentPage].title;

    useEffect(() => {
        if (DEFAULT_VIEW && currentPage !== 'settings') {
            setCurrentPage(DEFAULT_VIEW);
        }
    }, [DEFAULT_VIEW]);

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage, pageTitle }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
}

export function PageRenderer() {
    const { currentPage } = usePageContext();
    const PageComponent = PAGES[currentPage].component;

    return <PageComponent />;
}
