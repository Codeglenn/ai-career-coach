import { SidebarTrigger } from '@/components/ui/sidebar'
import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function AppHeader() {
    const { user } = useUser()
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress
    const userName = user?.firstName || user?.username || 'User'
    
    // Get initials from user name
    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        }
        return userName[0]?.toUpperCase() || 'U'
    }
    
    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 18) return 'Good Afternoon'
        return 'Good Evening'
    }
    
    const handleLogout = async () => {
        await user?.delete?.()
        // Alternatively, use Clerk's signOut if available
        window.location.href = '/sign-in'
    }
    
    return (
        <div className='p-4 shadow-sm flex items-center justify-between w-full'>
            <div className='flex flex-col'>
                <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                    {getGreeting()}, {userName}!
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Welcome back to AI Career Coach
                </p>
            </div>
            
            <div className='flex items-center gap-4'>
                <SidebarTrigger />
                {userEmail && (
                    <div className='relative'>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors'
                        >
                            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center'>
                                <span className='text-sm font-bold text-white'>
                                    {getInitials()}
                                </span>
                            </div>
                            <div className='flex flex-col items-start'>
                                <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                                    {userName}
                                </span>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                    {userEmail}
                                </span>
                            </div>
                            <ChevronDown className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 z-50'>
                                <Link href='/profile'>
                                    <button className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-700'>
                                        <UserIcon className='w-4 h-4' />
                                        View Profile
                                    </button>
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors'
                                >
                                    <LogOut className='w-4 h-4' />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppHeader