"use client"

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useContext, useEffect, useState, type ReactNode } from 'react'


function Provider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    const { user } = useUser();
    useEffect(() => {
        user && createNewUser();
    }, [user]);

    const createNewUser = async () => {
        const result = await axios.post('/api/user');
    }

    return (
        <div>
            {children}
        </div>
    )
}



export default Provider

