"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import RoadmapView, { RoadmapResponse } from "./_components/RoadmapView";
import { Button } from "@/components/ui/button";

type HistoryRecord = {
  content: RoadmapResponse | string | null;
  metaData?: string | null;
  createdAt?: string;
};

function CareerRoadmapDetail() {
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [meta, setMeta] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (recordId) {
      fetchRecord(recordId as string);
    }
  }, [recordId]);

  const fetchRecord = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/history/?recordId=${id}`);
      const data = res.data;
      const normalizedContent = normalizeRoadmapContent(data?.content);

      setRecord({
        ...data,
        content: normalizedContent,
      });

      if (data?.metaData) {
        const parsedMeta = typeof data.metaData === "string" ? safeJsonParse(data.metaData) : data.metaData;
        if (parsedMeta && typeof parsedMeta === "object") {
          setMeta(parsedMeta as Record<string, string>);
        }
      }
    } catch (error) {
      console.error("Failed to fetch roadmap record", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Career Roadmap Agent</p>
          <h1 className="text-2xl font-bold text-gray-900">Kenyan Career Roadmap</h1>
          <p className="text-sm text-gray-500">Record ID: {recordId}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {meta && Object.keys(meta).length > 0 && (
        <div className="bg-white rounded-xl border p-4 grid md:grid-cols-2 gap-4 shadow-sm">
          <div>
            <p className="text-xs uppercase text-gray-500">Target Career</p>
            <p className="text-sm text-gray-800">{meta.careerGoal || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Qualifications</p>
            <p className="text-sm text-gray-800">{meta.qualifications || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Grades & Achievements</p>
            <p className="text-sm text-gray-800">{meta.grades || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Interests</p>
            <p className="text-sm text-gray-800">{meta.interests || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-gray-500">Strengths</p>
            <p className="text-sm text-gray-800">{meta.strengths || "—"}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading roadmap...
        </div>
      ) : (
        <RoadmapView roadmap={(record?.content as RoadmapResponse) ?? null} />
      )}
    </div>
  );
}

export default CareerRoadmapDetail;

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Unable to parse JSON value", error);
    return null;
  }
}

function normalizeRoadmapContent(content: any): RoadmapResponse | null {
  if (!content) return null;

  let parsed = content;
  let rawText = "";

  if (typeof parsed === "string") {
    rawText = parsed;
    const attempt = safeJsonParse(parsed);
    if (attempt) {
      parsed = attempt;
    } else {
      return { rawText };
    }
  }

  if (parsed?.output?.[0]?.content) {
    parsed = parsed.output[0].content;
  }

  if (typeof parsed === "string") {
    return { rawText: parsed };
  }

  const summary = parsed?.summary ?? {};
  const phases = Array.isArray(parsed?.phases) ? parsed.phases : [];
  const skills = parsed?.skills ?? {};
  const kenyaInsights = parsed?.kenyaInsights ?? {};
  const nextSteps = parsed?.nextSteps ?? [];
  const combinedRawText = parsed?.rawText ?? rawText ?? "";

  const hasStructured =
    Object.keys(summary).length > 0 ||
    phases.length > 0 ||
    (skills.technical && skills.technical.length > 0) ||
    (skills.professional && skills.professional.length > 0) ||
    nextSteps.length > 0;

  if (!hasStructured) {
    return { rawText: combinedRawText || JSON.stringify(parsed, null, 2) };
  }

  return {
    summary: {
      headline: summary.headline || "",
      fitAssessment: summary.fitAssessment || "",
      demandOutlook: summary.demandOutlook || "",
      personaHook: summary.personaHook || "",
    },
    phases,
    skills: {
      technical: skills.technical ?? [],
      professional: skills.professional ?? [],
      certifications: skills.certifications ?? [],
    },
    kenyaInsights: {
      growthSectors: kenyaInsights.growthSectors ?? [],
      employers: kenyaInsights.employers ?? [],
      salaryRange: kenyaInsights.salaryRange ?? "",
      communities: kenyaInsights.communities ?? [],
    },
    nextSteps,
    rawText: combinedRawText,
  };
}

