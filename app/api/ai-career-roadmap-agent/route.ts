import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";

export async function POST(req: Request) {
  try {
    const { recordId, careerGoal, qualifications, grades, interests, strengths } = await req.json();

    if (!recordId || !careerGoal) {
      return NextResponse.json({ error: "recordId and careerGoal are required" }, { status: 400 });
    }

    const user = await currentUser();

    const prompt = buildRoadmapPrompt({
      careerGoal,
      qualifications,
      grades,
      interests,
      strengths,
    });

    const resultIds = await inngest.send({
      name: "CareerRoadmapAgent",
      data: {
        prompt,
      },
    });

    const runId = resultIds?.ids?.[0];
    if (!runId) {
      throw new Error("Unable to start CareerRoadmapAgent run");
    }

    let runStatus;
    while (true) {
      runStatus = await getRuns(runId);
      if (runStatus?.data?.[0]?.status === "Completed") {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const runOutput = runStatus?.data?.[0]?.output;
    const agentPayload =
      runOutput?.output ??
      runOutput?.body ??
      runOutput ??
      runStatus?.data?.[0];

    const roadmap = normalizeRoadmap(agentPayload);

    await db.insert(HistoryTable).values({
      recordId,
      content: roadmap,
      aiAgentType: "/ai-tools/career-roadmap-generator",
      createdAt: new Date().toString(),
      userEmail: user?.primaryEmailAddress?.emailAddress,
      metaData: JSON.stringify({
        careerGoal,
        qualifications,
        grades,
        interests,
        strengths,
      }),
    });

    return NextResponse.json({
      recordId,
      roadmap,
    });
  } catch (error) {
    console.error("Career roadmap agent failure", error);
    return NextResponse.json({ error: "Unable to generate roadmap" }, { status: 500 });
  }
}

function buildRoadmapPrompt({
  careerGoal,
  qualifications,
  grades,
  interests,
  strengths,
}: {
  careerGoal?: string;
  qualifications?: string;
  grades?: string;
  interests?: string;
  strengths?: string;
}) {
  return `
You are a Kenyan Career Roadmap AI agent. Craft a practical, localized roadmap aligned to Kenya's industries, regulatory bodies, employers, accelerators, and education system.

Context from the user (keep all details in plan):
- Target career: ${careerGoal}
- Qualifications: ${qualifications || "Not provided"}
- Grades & notable achievements: ${grades || "Not provided"}
- Interests & passions: ${interests || "Not provided"}
- Strengths / standout skills: ${strengths || "Not provided"}

Instructions:
1. Respond ONLY in valid JSON (no Markdown, comments, or code fences).
2. Tailor every detail to real Kenyan employers, counties, programs, or regulations.
3. Provide realistic timelines based on Kenyan talent pipelines.
4. Offer inclusive options for public, private, and community-based pathways.

JSON schema to follow exactly:
{
  "summary": {
    "headline": "string",
    "fitAssessment": "string",
    "demandOutlook": "string",
    "personaHook": "string"
  },
  "phases": [
    {
      "title": "string",
      "duration": "string",
      "objectives": ["string"],
      "keyActions": ["string"],
      "kenyaFocus": ["string"],
      "deliverables": ["string"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "professional": ["string"],
    "certifications": ["string"]
  },
  "kenyaInsights": {
    "growthSectors": ["string"],
    "employers": ["string"],
    "salaryRange": "string",
    "communities": ["string"]
  },
  "nextSteps": ["string"]
}

Ensure certifications, employers, and communities are Kenyan (e.g., NTSA, KIP, iHub, Safaricom, Kenya Bankers Association, etc.).
`;
}

async function getRuns(runId: string) {
  const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
  });
  return result.data;
}

function normalizeRoadmap(agentPayload: any) {
  const structured = tryExtractStructuredPayload(agentPayload);
  if (structured) {
    return mapToRoadmap(structured, JSON.stringify(structured, null, 2));
  }

  const rawText = extractText(agentPayload);
  if (!rawText) {
    return { rawText: "" };
  }

  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed: any | null = null;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    parsed = null;
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      rawText: cleaned || rawText,
    };
  }

  return mapToRoadmap(parsed, cleaned);
}

function extractText(payload: any): string {
  if (!payload) return "";

  if (typeof payload === "string") {
    return payload;
  }

  if (payload?.content) {
    if (typeof payload.content === "string") {
      return payload.content;
    }

    if (Array.isArray(payload.content)) {
      return payload.content
        .map((entry: any) => {
          if (typeof entry === "string") return entry;
          if (entry?.text) return entry.text;
          if (entry?.content) return entry.content;
          return "";
        })
        .join("\n")
        .trim();
    }
  }

  if (Array.isArray(payload)) {
    return payload
      .map((entry) => extractText(entry))
      .join("\n")
      .trim();
  }

  if (payload?.output?.[0]?.content) {
    return extractText(payload.output[0].content);
  }

  return "";
}

function tryExtractStructuredPayload(payload: any): any | null {
  if (!payload) return null;

  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  if (isRoadmapShape(payload)) {
    return payload;
  }

  if (payload?.output?.[0]?.content) {
    return tryExtractStructuredPayload(payload.output[0].content);
  }

  if (payload?.content) {
    return tryExtractStructuredPayload(payload.content);
  }

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const extracted = tryExtractStructuredPayload(entry);
      if (extracted) return extracted;
    }
  }

  return null;
}

function isRoadmapShape(value: any) {
  if (!value || typeof value !== "object") return false;
  return Boolean(
    value.summary ||
      value.phases ||
      value.skills ||
      value.kenyaInsights ||
      value.nextSteps
  );
}

function mapToRoadmap(parsed: any, rawText: string) {
  return {
    summary: {
      headline: parsed?.summary?.headline ?? "",
      fitAssessment: parsed?.summary?.fitAssessment ?? "",
      demandOutlook: parsed?.summary?.demandOutlook ?? "",
      personaHook: parsed?.summary?.personaHook ?? "",
    },
    phases: Array.isArray(parsed?.phases) ? parsed.phases : [],
    skills: {
      technical: parsed?.skills?.technical ?? [],
      professional: parsed?.skills?.professional ?? [],
      certifications: parsed?.skills?.certifications ?? [],
    },
    kenyaInsights: {
      growthSectors: parsed?.kenyaInsights?.growthSectors ?? [],
      employers: parsed?.kenyaInsights?.employers ?? [],
      salaryRange: parsed?.kenyaInsights?.salaryRange ?? "",
      communities: parsed?.kenyaInsights?.communities ?? [],
    },
    nextSteps: parsed?.nextSteps ?? [],
    rawText,
  };
}

