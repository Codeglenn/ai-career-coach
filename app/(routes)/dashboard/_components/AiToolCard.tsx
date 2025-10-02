import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TOOL{
    name: string,
    desc: string,
    icon: string,
    button: string,
    path: string
}

type AIToolProps={
    tool:TOOL
}

function AiToolCard({ tool }: AIToolProps) {
    return (
        <div className="p-5 bg-white border-2 border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center">
            <div className="bg-blue-50 rounded-full p-2 shadow-sm mb-3 flex items-center justify-center" style={{ width: 56, height: 56 }}>
                <Image src={tool.icon} width={40} height={40} alt={tool.name} />
            </div>
            <h2 className="font-bold text-lg text-blue-700 mb-1">{tool.name}</h2>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">{tool.desc}</p>
            <Link href={tool.path} className="w-full">
                <Button
                    size="lg"
                    className="w-full mt-2 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-700 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-violet-600 border-none transition-all duration-200"
                >
                    {tool.button}
                </Button>
            </Link>
        </div>
    );
}

export default AiToolCard