import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import axios from "axios";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req:NextRequest) {
    const FormData = await req.formData();
    const resumeFile:any = FormData.get('resumeFile');
    const recordId = FormData.get('recordId');
    const user = await currentUser();
    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    console.log(docs[0]);//Raw Pdf text 

    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const resultIds = await inngest.send({
            name:'AiResumeAgent',
            data:{
                recordId:recordId,
                base64ResumeFile:base64,
                pdfText:docs[0]?.pageContent,
                aiAgentType:'/ai-tools/ai-resume-analyzer',
                userEmail:user?.primaryEmailAddress?.emailAddress
            }
        });
        const runId = resultIds?.ids[0];
    
        let runStatus;
        while(true){
            runStatus = await getRuns(runId);
            if(runStatus?.data[0]?.status === 'Completed'){
                break;
            }
            await new Promise(resolve=>setTimeout(resolve, 500))
        }
        const outputPayload = runStatus?.data?.[0]?.output?.output?.[0] ?? {};

        return NextResponse.json(JSON.parse(JSON.stringify(outputPayload)));
    }
    
    export async function getRuns(runId:string) {
        const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,{
            headers:{
                Authorization:`Bearer ${process.env.INNGEST_SIGNING_KEY}`
            }
        });
        return result.data
}