import React from 'react'

const questionList=[
    'What are the most in-demand AI job roles in 2025?',
    'What skills are best for remote careers?',
    'What are good habits for professional success?',
    'How do I prepare for a job interview?',
    'What are some effective networking strategies?',
]

function EmptyState({ selectedQuestion }: { selectedQuestion: (question: string) => void }) {
  return (
    <div>
        <h2 className='font-bold text-xl text-center'>Ask anything to the Q&A Chatbot</h2>
        <div className='text-center'>
            {questionList.map((question, index)=>(
                <h2 className='p-4 inline-block border rounded-lg my-3 hover:border-primary cursor-pointer'
                key={index}
                onClick={()=>selectedQuestion(question)}>{question}</h2>
            ))}
        </div>
    </div>
  )
}

export default EmptyState
