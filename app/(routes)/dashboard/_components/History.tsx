"use client"
import Image from 'next/image';
import React, { use, useState } from 'react'

function History() {
    const[userHistory, setUserHistory] = useState([]);
  return (
    <div className='mt-5 p-5 border rounded-xl'>
        <h2 className='font-bold text-lg'>My History</h2>
        <p className='text-gray-400'>Here you can find your past interactions and activities.</p>

        {userHistory?.length == 0 &&
            <div className='flex items-center justify-center mt-5 flex-col mt-6'>
                <Image src={'/bulb.png'} alt='bulb' 
                width={100} 
                height={100} 
                />
                <h2 className='text-gray-400'>No history found</h2>
            </div>
        }
    </div>
  )
}

export default History
