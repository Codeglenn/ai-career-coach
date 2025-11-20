import React from 'react'

const questionList=[
    'What career fields are growing fastest in Kenya, and what skills do they require?',
    'How can someone in Kenya build a strong professional brand both online and offline?',
    'What are effective strategies for job hunting in the Kenyan market?',
    'How can fresh graduates in Kenya gain practical experience if they lack work history?',
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
