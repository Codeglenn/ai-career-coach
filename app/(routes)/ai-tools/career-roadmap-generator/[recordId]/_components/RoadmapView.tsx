'use client';

import React from 'react';
import Markdown from 'react-markdown';

export type RoadmapResponse = {
  summary?: {
    headline?: string;
    fitAssessment?: string;
    demandOutlook?: string;
    personaHook?: string;
  };
  phases?: Array<{
    title?: string;
    duration?: string;
    objectives?: string[];
    keyActions?: string[];
    kenyaFocus?: string[];
    deliverables?: string[];
  }>;
  skills?: {
    technical?: string[];
    professional?: string[];
    certifications?: string[];
  };
  kenyaInsights?: {
    growthSectors?: string[];
    employers?: string[];
    salaryRange?: string;
    communities?: string[];
  };
  nextSteps?: string[];
  rawText?: string;
};

const renderList = (items?: string[]) => {
  if (!items || items.length === 0) return null;
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`}>{item}</li>
      ))}
    </ul>
  );
};

function RoadmapView({ roadmap }: { roadmap: RoadmapResponse | null }) {
  if (!roadmap) {
    return (
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <p className="text-gray-500">No roadmap data available yet. Please generate one from the dashboard.</p>
      </div>
    );
  }

  const hasStructuredRoadmap =
    roadmap.summary ||
    (roadmap.phases && roadmap.phases.length > 0) ||
    (roadmap.skills &&
      ((roadmap.skills.technical && roadmap.skills.technical.length > 0) ||
        (roadmap.skills.professional && roadmap.skills.professional.length > 0)));

  if (!hasStructuredRoadmap) {
    return (
      <div className="rounded-xl border p-6 bg-white shadow-sm prose prose-sm max-w-none">
        <Markdown>{roadmap.rawText ?? 'Roadmap details unavailable.'}</Markdown>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roadmap.summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Headline</p>
            <p className="text-base font-semibold text-gray-900">{roadmap.summary.headline}</p>
            <p className="text-xs text-gray-500 mt-2">{roadmap.summary.personaHook}</p>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Demand Outlook</p>
            <p className="text-sm text-gray-800">{roadmap.summary.demandOutlook}</p>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Fit Assessment</p>
            <p className="text-sm text-gray-800">{roadmap.summary.fitAssessment}</p>
          </div>
        </div>
      )}

      {roadmap.phases && roadmap.phases.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Phased Game Plan</h3>
          <div className="space-y-3">
            {roadmap.phases.map((phase, idx) => (
              <div key={`${phase.title}-${idx}`} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-blue-800">{phase.title}</p>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{phase.duration}</span>
                </div>
                {renderList(phase.objectives)}
                {phase.keyActions && phase.keyActions.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">Key Actions</p>
                    {renderList(phase.keyActions)}
                  </div>
                )}
                {phase.kenyaFocus && phase.kenyaFocus.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">Kenya Focus</p>
                    {renderList(phase.kenyaFocus)}
                  </div>
                )}
                {phase.deliverables && phase.deliverables.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">Deliverables</p>
                    {renderList(phase.deliverables)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {roadmap.skills && (
        <div className="grid gap-4 md:grid-cols-3">
          {roadmap.skills.technical && roadmap.skills.technical.length > 0 && (
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 mb-2">Technical Stack</p>
              {renderList(roadmap.skills.technical)}
            </div>
          )}
          {roadmap.skills.professional && roadmap.skills.professional.length > 0 && (
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 mb-2">Professional Edge</p>
              {renderList(roadmap.skills.professional)}
            </div>
          )}
          {roadmap.skills.certifications && roadmap.skills.certifications.length > 0 && (
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 mb-2">Certifications</p>
              {renderList(roadmap.skills.certifications)}
            </div>
          )}
        </div>
      )}

      {roadmap.kenyaInsights && (
        <div className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
          <p className="text-xs uppercase text-gray-500">Kenyan Industry Snapshot</p>
          {renderList(roadmap.kenyaInsights.growthSectors)}
          {roadmap.kenyaInsights.employers && roadmap.kenyaInsights.employers.length > 0 && (
            <>
              <p className="text-xs uppercase text-gray-500 mt-2">Employers & Hubs</p>
              {renderList(roadmap.kenyaInsights.employers)}
            </>
          )}
          {roadmap.kenyaInsights.communities && roadmap.kenyaInsights.communities.length > 0 && (
            <>
              <p className="text-xs uppercase text-gray-500 mt-2">Communities & Associations</p>
              {renderList(roadmap.kenyaInsights.communities)}
            </>
          )}
          {roadmap.kenyaInsights.salaryRange && (
            <p className="text-xs text-gray-500 mt-2">Salary Outlook: {roadmap.kenyaInsights.salaryRange}</p>
          )}
        </div>
      )}

      {roadmap.nextSteps && roadmap.nextSteps.length > 0 && (
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Next Moves</p>
          {renderList(roadmap.nextSteps)}
        </div>
      )}

    </div>
  );
}

export default RoadmapView;

