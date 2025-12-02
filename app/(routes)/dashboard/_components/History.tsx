"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Clock, MessageSquare, FileText, Map } from 'lucide-react';

type HistoryItem = {
    id?: number;
    recordId: string;
    content: any;
    userEmail: string;
    createdAt: string;
    aiAgentType: string;
    metaData?: string;
};

function History() {
    const [userHistory, setUserHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserHistory();
    }, []);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/history');
            if (Array.isArray(result.data)) {
                // Sort by most recent first
                const sorted = result.data.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA; // Most recent first
                });
                setUserHistory(sorted);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAgentIcon = (agentType: string) => {
        if (agentType?.includes('chatbot')) return <MessageSquare className='w-5 h-5 text-blue-500' />;
        if (agentType?.includes('resume')) return <FileText className='w-5 h-5 text-green-500' />;
        if (agentType?.includes('roadmap')) return <Map className='w-5 h-5 text-purple-500' />;
        return <Clock className='w-5 h-5 text-gray-500' />;
    };

    const getAgentName = (agentType: string) => {
        if (agentType?.includes('chatbot')) return 'Career Chat';
        if (agentType?.includes('resume')) return 'Resume Analyzer';
        if (agentType?.includes('roadmap')) return 'Career Roadmap';
        return 'Unknown';
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const handleViewHistory = (item: HistoryItem) => {
        if (item.aiAgentType?.includes('chatbot')) {
            router.push(`/ai-tools/ai-chatbot/${item.recordId}`);
        } else if (item.aiAgentType?.includes('resume')) {
            router.push(`/ai-tools/ai-resume-analyzer/${item.recordId}`);
        } else if (item.aiAgentType?.includes('roadmap')) {
            router.push(`/ai-tools/career-roadmap-generator/${item.recordId}`);
        }
    };

    if (loading) {
        return (
            <div className='mt-5 p-5 border rounded-xl'>
                <h2 className='font-bold text-lg'>My History</h2>
                <p className='text-gray-400'>Loading your history...</p>
            </div>
        );
    }

    return (
        <div className='mt-5 p-5 border rounded-xl'>
            <h2 className='font-bold text-lg'>My History</h2>
            <p className='text-gray-400 mb-4'>Here you can find your past interactions and activities.</p>

            {userHistory?.length === 0 ? (
                <div className='flex items-center justify-center mt-5 flex-col'>
                    <Image src={'/bulb.png'} alt='bulb' width={100} height={100} />
                    <h2 className='text-gray-400 mt-3'>No history found</h2>
                </div>
            ) : (
                <div className='grid gap-3 mt-4'>
                    {userHistory.map((item, index) => (
                        <button
                            key={item.id ? `history-${item.id}` : `history-${index}`}
                            onClick={() => handleViewHistory(item)}
                            className='flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg hover:shadow-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all text-left'
                        >
                            <div className='flex items-center gap-4 flex-1'>
                                <div className='p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg'>
                                    {getAgentIcon(item.aiAgentType)}
                                </div>
                                <div className='flex-1'>
                                    <p className='font-semibold text-gray-900 dark:text-gray-100'>
                                        {getAgentName(item.aiAgentType)}
                                    </p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        {formatDate(item.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className='text-right'>
                                <p className='text-xs text-gray-400'>ID: {item.recordId.slice(0, 8)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History
