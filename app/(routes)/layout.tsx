import React from 'react';
import type { ReactNode } from 'react';
import DashboardProvider from './provider';


function DashboardLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    return (
        <DashboardProvider>
            {children}
        </DashboardProvider>
    )
}

export default DashboardLayout