"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import Markdown from 'react-markdown'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

type messages = {
    content:string,
    role:string,
    type:string
}


function AiChatbot() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageList] = useState<messages[]>();
    const {chatid}:any = useParams();
    const router = useRouter();
    console.log(chatid);
    

    useEffect(()=>{
        chatid&&getMessages();
    }, [chatid])

    const getMessages = async()=>{
        const result = await axios.get(`/api/history/?recordId=${chatid}`);
        console.log(result.data);
        setMessageList(result.data?.content);
    }

    const onSend = async()=>{
        setLoading(true);

        setMessageList(prev => [ ...(prev ?? []), {
            content: userInput,
            role: 'user',
            type: 'text'
        }])

        setUserInput('');

        const result = await axios.post('/api/ai-career-chat-agent',{
            userInput:userInput
        });

        console.log(result.data);
        setMessageList(prev => [ ...(prev ?? []), result.data ])
        setLoading(false);
    }

    console.log(messageList);

    useEffect(()=>{
        //Save message into Database
        messageList && messageList.length > 0 && updateMessagesList();
    }, [messageList])

    const updateMessagesList = async ()=>{
        const result = await axios.put('/api/history',{
            content:messageList,
            recordId:chatid
        });
        console.log(result);
    }

    const onNewChat = async()=>{
        const id = uuidv4();
        //Create New Record to History Table
        const result = await axios.post('/api/history',{
            recordId:id,
            content:[]
        });
        console.log(result);
        setMessageList([]);
        router.replace(`/ai-tools/ai-chatbot/${id}`)
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div>
                    <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AI Career Q&A Chatbot</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chat with our AI-powered career coach to get personalized advice and answers to your questions.</p>
                </div>
                <Button onClick={onNewChat} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">+ New Chat</Button>
            </div>
            
            <div className='flex flex-col h-[calc(100vh-120px)] overflow-hidden'>
                {/* Empty state options */}
                {(messageList?.length ?? 0) <= 0 && (
                    <div className="flex-1 overflow-y-auto">
                        <EmptyState selectedQuestion={(question:string)=>setUserInput(question)} />
                    </div>
                )}

                {/* Message list */}
                {(messageList?.length ?? 0) > 0 && (
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {messageList?.map((message, index) => (
                            <div key={index}>
                                <div className={`flex mb-3 ${message.role=='user'?'justify-end':'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.role=='user'?
                                        'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-br-none shadow-md':
                                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-md border border-gray-200 dark:border-gray-700"
                                        }`}>
                                        <div className={message.role=='user' ? 'text-white' : ''}>
                                            <Markdown>
                                                {message.content}
                                            </Markdown>
                                        </div>
                                    </div>
                                </div>
                                {loading && messageList?.length-1 === index && (
                                    <div className='flex justify-start px-4 py-3 rounded-2xl gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-3 shadow-md border border-gray-200 dark:border-gray-700 rounded-bl-none w-fit'>
                                        <LoaderCircle className='animate-spin w-5 h-5 text-blue-600'/>
                                        <span className='text-sm'>Thinking...</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
        
                {/*Input area */}
                <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex gap-3 items-center">
                        <Input 
                            className="flex-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:ring-offset-0" 
                            placeholder="Type your message..." 
                            value={userInput} 
                            onChange={(event) => setUserInput(event.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && onSend()}
                        />
                        <Button 
                            onClick={onSend} 
                            disabled={loading} 
                            aria-label="Send"
                            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full p-3 h-auto"
                        >
                            <Send className='w-5 h-5' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiChatbot
