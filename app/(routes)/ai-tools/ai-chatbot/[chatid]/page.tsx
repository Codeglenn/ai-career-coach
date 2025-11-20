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
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-1">
                <div>
                    <h2 className="font-bold text-lg">AI Career Q&A Chatbot</h2>
                    <p className="text-sm text-muted-foreground">Chat with our AI-powered career coach to get personalized advice and answers to your questions.</p>
                </div>
                <Button onClick={onNewChat}>+ New Chat</Button>
            </div>
            <div className='flex flex-col h-[75vh]'>
                {/* Empty state options */}
               {(messageList?.length ?? 0) <= 0 && <div>
                    <EmptyState selectedQuestion={(question:string)=>setUserInput(question)} />
                </div>}

                {/* Message list */}
                <div className="flex-1">
                    {messageList?.map((message, index) => (
                        <div key={index}>
                            <div className={`flex mb-2 ${message.role=='user'?'justify-end':'justify-start'}`}>
                                <div className={`p-3 rounded-lg gap-2 ${message.role=='user'?
                                    'bg-gray-200 text-black rounded-lg':
                                    "bg-gray-50 text-black"
                                    }`}>
                                    <Markdown>
                                        {message.content}
                                    </Markdown>
                                </div>
                            </div>
                            {loading && messageList?.length-1 === index && (
                                <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2'>
                                    <LoaderCircle className='animate-spin'/>Thinking...
                                </div>
                            )}
                        </div>
                    ))}
            
                    {/*Input area */}
                    <div className="flex justify-between items-center gap-3">
                        <Input className="flex-1" placeholder="Type your message..." value={userInput} onChange={(event) => setUserInput(event.target.value)} />
                        <Button onClick={onSend} disabled={loading} aria-label="Send"><Send /></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiChatbot
