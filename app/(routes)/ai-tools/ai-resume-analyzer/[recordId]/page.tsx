"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Report from './_components/Report';

function AiResumeAnalyzer() {
    const {recordId} = useParams();
    const [pdfUrl, setPdfUrl] = useState();
    const [aiReport, setAiReport]=useState();
    useEffect(()=>{
        recordId&&GetResumeAnalyzerRecord();
    }, [recordId])
    const GetResumeAnalyzerRecord = async()=>{
        const result = await axios.get(`/api/history/?recordId=${recordId}`);
        console.log(result.data);
        setPdfUrl(result.data?.metaData);
        setAiReport(result.data?.content);
    }
    return (
        <div>
            <div className='col-span-2'>
                <Report aiReport = {aiReport}/>
            </div>
        </div>
    )
}

export default AiResumeAnalyzer;