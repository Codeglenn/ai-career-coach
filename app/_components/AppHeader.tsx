import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'


function AppHeader() {
    return (
        <div className='p-2 shadow-sm flex items-center justify-between w-full '>
            <SidebarTrigger />

        </div>
    )
}

export default AppHeader