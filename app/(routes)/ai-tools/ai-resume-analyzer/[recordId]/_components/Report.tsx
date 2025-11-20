import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import React, { useState } from 'react'

type SectionScore = {
    score?: number | string;
    comment?: string;
};

type AiReport = {
    overall_score?: number;
    overall_feedback?: string;
    summary_comment?: string;
    sections?: {
        contact_info?: SectionScore;
        experience?: SectionScore;
        education?: SectionScore;
        skills?: SectionScore;
    };
    tips_for_improvement?: string[];
    whats_good?: string[];
    needs_improvement?: string[];
};

type ReportProps = {
    aiReport?: AiReport;
};

const clampScore = (value: number) => Math.min(100, Math.max(0, value));

const normalizeScore = (value?: number | string) => {
    if (value === undefined || value === null) return undefined;
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numeric !== 'number' || Number.isNaN(numeric)) return undefined;
    return clampScore(numeric);
};

const getScorePalette = (value?: number | string) => {
    const score = normalizeScore(value);
    if (score === undefined) {
        return { text: 'text-gray-400', bar: 'bg-gray-300' };
    }
    if (score >= 80) {
        return { text: 'text-blue-600', bar: 'bg-blue-600' };
    }
    if (score >= 60) {
        return { text: 'text-yellow-500', bar: 'bg-yellow-500' };
    }
    return { text: 'text-red-500', bar: 'bg-red-500' };
};

function Report({ aiReport }: ReportProps) {
    const [openResumeUpload, setOpenResumeDialog] = useState(false);
    const overallPalette = getScorePalette(aiReport?.overall_score);
    const overallScoreWidth = normalizeScore(aiReport?.overall_score) ?? 0;
    const sections = aiReport?.sections;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">AI Analysis Results</h2>
                <button type="button" onClick={()=>setOpenResumeDialog(true)}>
                    Re-analyze <i className="fa-solid fa-sync ml-2"></i>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
                </h3>
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-6xl font-extrabold ${overallPalette.text}`}>
                        {aiReport?.overall_score ?? '--'}
                        <span className="text-2xl">/100</span>
                    </span>
                    <div className="flex items-center">
                        <i className="fas fa-arrow-up text-green-500 text-lg mr-2"></i>
                        <span className="text-green-500 text-lg font-bold">{aiReport?.overall_feedback ?? 'Analyzing...'}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className={`${overallPalette.bar} h-2.5 rounded-full`} style={{ width: `${overallScoreWidth}%` }}></div>
                </div>
                <p className="text-gray-600 text-sm">{aiReport?.summary_comment ?? 'Your resume analysis will appear here shortly.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3"><i className="fas fa-user-circle text-gray-500 mr-2"></i> Contact Info</h4>
                    <span className={`text-4xl font-bold ${getScorePalette(sections?.contact_info?.score).text}`}>
                        {sections?.contact_info?.score ?? '--'}%
                    </span>
                    <p className="text-sm text-gray-600 mt-2">{sections?.contact_info?.comment ?? 'Awaiting feedback.'}</p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3"><i className="fas fa-briefcase text-gray-500 mr-2"></i> Experience</h4>
                    <span className={`text-4xl font-bold ${getScorePalette(sections?.experience?.score).text}`}>
                        {sections?.experience?.score ?? '--'}%
                    </span>
                    <p className="text-sm text-gray-600 mt-2">{sections?.experience?.comment ?? 'Awaiting feedback.'}</p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-yellow-200 relative overflow-hidden group">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3"><i className="fas fa-graduation-cap text-gray-500 mr-2"></i> Education</h4>
                    <span className={`text-4xl font-bold ${getScorePalette(sections?.education?.score).text}`}>
                        {sections?.education?.score ?? '--'}%
                    </span>
                    <p className="text-sm text-gray-600 mt-2">{sections?.education?.comment ?? 'Awaiting feedback.'}</p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-red-200 relative overflow-hidden group">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3"><i className="fas fa-lightbulb text-gray-500 mr-2"></i> Skills</h4>
                    <span className={`text-4xl font-bold ${getScorePalette(sections?.skills?.score).text}`}>
                        {sections?.skills?.score ?? '--'}%
                    </span>
                    <p className="text-sm text-gray-600 mt-2">{sections?.skills?.comment ?? 'Awaiting feedback.'}</p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                <h3 className="text-xl font-bold highlight-text mb-4 flex items-center">
                    <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
                </h3>
                <ol className="list-none space-y-4">
                    {aiReport?.tips_for_improvement?.length ? (
                        aiReport.tips_for_improvement.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{index + 1}</span>
                                <p className="text-sm">{item}</p>
                            </li>
                        ))
                    ) : (
                        <li className="text-sm text-gray-500">No tips available yet.</li>
                    )}
                </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                        <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        {aiReport?.whats_good?.length ? (
                            aiReport.whats_good.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        ) : (
                            <li className="text-gray-500">Awaiting strengths summary.</li>
                        )}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                        <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        {aiReport?.needs_improvement?.length ? (
                            aiReport.needs_improvement.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        ) : (
                            <li className="text-gray-500">Awaiting improvement summary.</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6 text-center gradient-button-bg">
                <h3 className="text-2xl font-bold mb-3">Ready to refine your resume? 💪</h3>
                <p className="text-base mb-4">Make your application stand out with our premium insights and features.</p>
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                    Upgrade to Premium <i className="fas fa-arrow-right ml-2 text-blue-600"></i>
                </button>
            </div>
            <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={()=>setOpenResumeDialog(false)} />
        </div>
    );
}

export default Report;