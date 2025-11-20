import path from 'path'
import React from 'react'
import AiToolCard from './AiToolCard'

const aiToolsList=[
    {
        name:'AI Q&A Chatbot',
        desc:'Chat With AI Chatbot Agent',
        icon:'/chat-bot.png',
        button:'Let`s Chat',
        path:'/ai-tools/ai-chatbot'
    },
    {
        name:'AI Resume Analyzer',
        desc:'Improve Your Resume',
        icon:'/resume-analyzer.png',
        button:'Analyze Now',
        path:'/ai-tools/ai-resume-analyzer'
    },
    {
        name:'Roadmap Generator',
        desc:'Build Your Roadmap',
        icon:'/career-roadmap.png',
        button:'Generate Now',
        path:'/ai-tools/career-roadmap-generator'
    }
]

function AiTools() {
  return (
    <div className='mt-7 p-5 bg-white border rounded-xl'>
        <h2 className="font-bold text-2xl sm:text-3xl mb-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-tight">
            Available AI Tools
        </h2>
        <p className="text-base sm:text-lg text-blue-900 opacity-80 mb-4 leading-relaxed">
            Start Building and Shaping Your Career with these AI Tools
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4'>
            {aiToolsList.map((tool:any, index) =>(
                <AiToolCard tool={tool} key={index} />
            ))}

        </div>
    </div>
  )
}

export default AiTools 