"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React, { use, useState } from 'react'
import EmptyState from './_components/EmptyState'

function AiChatbot() {
    const [userInput, setUserInput] = useState<string>();
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-1">
                <div>
                    <h2 className="font-bold text-lg">AI Career Q&A Chatbot</h2>
                    <p className="text-sm text-muted-foreground">Chat with our AI-powered career coach to get personalized advice and answers to your questions.</p>
                </div>
                <Button>+ New Chat</Button>
            </div>
            <div className='flex flex-col h-[75vh]'>
                {/* Empty state options */}
                <div>
                    <EmptyState selectedQuestion={(question:string)=>setUserInput(question)} />
                </div>

                {/* Message list */}
                <div className="flex-1">

                </div>
            
            
                    {/*Input area */}
                <div className="flex justify-between items-center gap-3">
                    <Input className="flex-1" placeholder="Type your message..." value={userInput} onChange={(event) => setUserInput(event.target.value)} />
                    <Button aria-label="Send"><Send /></Button>
                </div>
            </div>
        </div>
    )
}

export default AiChatbot
