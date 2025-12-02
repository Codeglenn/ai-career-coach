'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Map, NotebookPen, Sparkles, Target, Waypoints } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import { useRouter } from 'next/navigation';

type CareerRoadmapDialogProps = {
  openCareerRoadmap: boolean;
  setOpenCareerRoadmap: (val: boolean) => void;
};

type RoadmapResponse = {
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

const defaultForm = {
  careerGoal: '',
  qualifications: '',
  grades: '',
  interests: '',
  strengths: '',
};

function CareerRoadmapDialog({
  openCareerRoadmap,
  setOpenCareerRoadmap,
}: CareerRoadmapDialogProps) {
  const [form, setForm] = React.useState(defaultForm);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [recordId, setRecordId] = React.useState('');
  const [roadmap, setRoadmap] = React.useState<RoadmapResponse | null>(null);
  const router = useRouter();

  const handleClose = () => {
    setOpenCareerRoadmap(false);
    setForm(defaultForm);
    setRoadmap(null);
    setError(null);
    setRecordId('');
    setLoading(false);
  };

  const onGenerate = async () => {
    if (!form.careerGoal.trim()) {
      setError('Please describe the career you want to pursue.');
      return;
    }
    setError(null);
    setLoading(true);
    const id = uuidv4();
    setRecordId(id);

    try {
      const response = await axios.post('/api/ai-career-roadmap-agent', {
        recordId: id,
        ...form,
      });
      setRoadmap(response.data?.roadmap ?? null);
      const savedId = response.data?.recordId ?? id;
      setRecordId(savedId);
      router.push(`/ai-tools/career-roadmap-generator/${savedId}`);
    } catch (err) {
      console.error(err);
      setError('Unable to generate a roadmap right now. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const hasStructuredRoadmap = useMemo(() => {
    return Boolean(
      roadmap?.summary ||
        (roadmap?.phases && roadmap?.phases.length > 0) ||
        (roadmap?.skills &&
          ((roadmap.skills.technical && roadmap.skills.technical.length > 0) ||
            (roadmap.skills.professional && roadmap.skills.professional.length > 0)))
    );
  }, [roadmap]);

  return (
    <Dialog open={openCareerRoadmap} onOpenChange={(open) => (open ? setOpenCareerRoadmap(open) : handleClose())}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-500" />
            Kenyan Career Roadmap Agent
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Share the career you&apos;re targeting plus your academic background. The agent will
            craft a Kenyan market-aligned roadmap highlighting milestones, skills, and employers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                Target Career or Role
              </label>
              <Input
                placeholder="e.g., Data Analyst in fintech"
                value={form.careerGoal}
                onChange={(e) => setForm((prev) => ({ ...prev, careerGoal: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <NotebookPen className="w-4 h-4 text-blue-500" />
                Key Qualifications
              </label>
              <Input
                placeholder="e.g., BCom Finance, CPA Section 3"
                value={form.qualifications}
                onChange={(e) => setForm((prev) => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Grades & Achievements</label>
              <Input
                placeholder="e.g., KCSE B+, Top 10% in class, Hackathon finalist"
                value={form.grades}
                onChange={(e) => setForm((prev) => ({ ...prev, grades: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Interests & Passions</label>
              <Input
                placeholder="e.g., Community banking, inclusive finance, ESG reporting"
                value={form.interests}
                onChange={(e) => setForm((prev) => ({ ...prev, interests: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Strengths or Standout Skills</label>
            <textarea
              placeholder="List tools, soft skills, languages, leadership roles, etc."
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.strengths}
              onChange={(e) => setForm((prev) => ({ ...prev, strengths: e.target.value }))}
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                The agent returns a Kenyan-tailored roadmap referencing real employers, bodies, and industry standards.
              </p>
            </div>
            <Button disabled={loading} onClick={onGenerate} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </Button>
          </div>

          {roadmap && (
            <div className="border rounded-xl p-4 bg-gray-50 space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <Waypoints className="w-5 h-5 text-blue-500" />
                Personalized Roadmap
              </h3>
              {recordId && (
                <p className="text-xs text-gray-500">
                  Reference ID: <span className="font-mono">{recordId.slice(0, 8)}</span> (saved to your history)
                </p>
              )}

              {hasStructuredRoadmap ? (
                <div className="space-y-4">
                  {roadmap.summary && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        <p className="text-xs uppercase text-gray-500">Headline</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {roadmap.summary.headline || 'Kenyan Career Path'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{roadmap.summary.personaHook}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        <p className="text-xs uppercase text-gray-500">Demand Outlook</p>
                        <p className="text-sm text-gray-800">{roadmap.summary.demandOutlook || 'Strong demand nationwide'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        <p className="text-xs uppercase text-gray-500">Fit Assessment</p>
                        <p className="text-sm text-gray-800">{roadmap.summary.fitAssessment || 'Great match'}</p>
                      </div>
                    </div>
                  )}

                  {roadmap.phases && roadmap.phases.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Phased Game Plan</h4>
                      <div className="space-y-3">
                        {roadmap.phases.map((phase, index) => (
                          <div key={phase.title ?? index} className="p-3 bg-white rounded-lg border shadow-sm">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="font-semibold text-blue-800">{phase.title}</p>
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                {phase.duration}
                              </span>
                            </div>
                            {renderList(phase.objectives)}
                            {phase.keyActions && phase.keyActions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs uppercase text-gray-500">Key Actions</p>
                                {renderList(phase.keyActions)}
                              </div>
                            )}
                            {phase.kenyaFocus && phase.kenyaFocus.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs uppercase text-gray-500">Kenya Focus</p>
                                {renderList(phase.kenyaFocus)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {roadmap.skills && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {roadmap.skills.technical && roadmap.skills.technical.length > 0 && (
                        <div className="bg-white rounded-lg border p-3 shadow-sm">
                          <p className="text-xs uppercase text-gray-500 mb-1">Technical Stack</p>
                          {renderList(roadmap.skills.technical)}
                        </div>
                      )}
                      {roadmap.skills.professional && roadmap.skills.professional.length > 0 && (
                        <div className="bg-white rounded-lg border p-3 shadow-sm">
                          <p className="text-xs uppercase text-gray-500 mb-1">Professional Edge</p>
                          {renderList(roadmap.skills.professional)}
                        </div>
                      )}
                      {roadmap.skills.certifications && roadmap.skills.certifications.length > 0 && (
                        <div className="bg-white rounded-lg border p-3 shadow-sm">
                          <p className="text-xs uppercase text-gray-500 mb-1">Certifications</p>
                          {renderList(roadmap.skills.certifications)}
                        </div>
                      )}
                    </div>
                  )}

                  {roadmap.kenyaInsights && (
                    <div className="bg-white rounded-lg border p-3 shadow-sm space-y-2">
                      <p className="text-xs uppercase text-gray-500">Kenyan Industry Snapshot</p>
                      {renderList(roadmap.kenyaInsights.growthSectors)}
                      {roadmap.kenyaInsights.employers && roadmap.kenyaInsights.employers.length > 0 && (
                        <>
                          <p className="text-xs uppercase text-gray-500 mt-2">Employers / Hubs</p>
                          {renderList(roadmap.kenyaInsights.employers)}
                        </>
                      )}
                      {roadmap.kenyaInsights.communities && roadmap.kenyaInsights.communities.length > 0 && (
                        <>
                          <p className="text-xs uppercase text-gray-500 mt-2">Communities & Bodies</p>
                          {renderList(roadmap.kenyaInsights.communities)}
                        </>
                      )}
                      {roadmap.kenyaInsights.salaryRange && (
                        <p className="text-xs text-gray-500 mt-2">Salary Outlook: {roadmap.kenyaInsights.salaryRange}</p>
                      )}
                    </div>
                  )}

                  {roadmap.nextSteps && roadmap.nextSteps.length > 0 && (
                    <div className="bg-white rounded-lg border p-3 shadow-sm">
                      <p className="text-xs uppercase text-gray-500">Next 3 Moves</p>
                      {renderList(roadmap.nextSteps)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <Markdown>{roadmap.rawText ?? 'Roadmap generated. Expand the prompt for richer detail.'}</Markdown>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {recordId && roadmap && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/ai-tools/career-roadmap-generator/${recordId}`)}
            >
              View full roadmap page
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CareerRoadmapDialog;

