import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { AiCareerAgent, AiResumeAgent, CareerRoadmapAgent } from "@/inngest/functions";

export const runtime = "nodejs";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    AiCareerAgent,
    AiResumeAgent,
    CareerRoadmapAgent
  ],
});