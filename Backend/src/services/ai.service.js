const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A precise percentage score between 0 to 100 evaluating how well the candidate matches the job requirements"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("Specific, hyper-relevant technical question directly tied to the candidate's actual resume content, projects, skills, or the job description"),
        category: z.enum(["project", "skill", "job-description"]).describe("The source category: 'project' for questions from candidate projects, 'skill' for questions from listed skills, 'job-description' for questions from JD requirements"),
        intention: z.string().describe("What the interviewer is specifically probing"),
        answer: z.string().describe("An exhaustive, multi-paragraph model answer covering theory, implementation, trade-offs, production gotchas. Minimum 4-6 paragraphs.")
    })).min(10).max(15).describe("10 to 15 resume-specific technical questions: 4-5 from projects, 2-3 from skills, 4-5 from job description"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Targeted behavioral or situational question relevant to engineering team dynamics"),
        intention: z.string().describe("What the interviewer wants to observe"),
        answer: z.string().describe("An in-depth STAR format model answer with concrete decisions, quantitative outcomes, and leadership lessons. Minimum 3-4 paragraphs.")
    })).min(4).max(6).describe("4 to 6 rigorous behavioral questions with full STAR method answers"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("Specific technical skill the candidate lacks relative to the job description"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity level of this gap for the target role")
    })).describe("Skill gaps identified relative to the job description"),
    preperationPlan: z.array(z.object({
        day: z.number().describe("Day number starting from 1"),
        focus: z.string().describe("Strategic focus area for this study day"),
        tasks: z.array(z.string()).describe("Actionable study items and coding exercises")
    })).describe("A structured 5-7 day progressive interview preparation sprint")
})

function isTemporaryAiError(error) {
    const status = error?.status || error?.code || error?.error?.code
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are a Principal Software Engineer and Senior Technical Hiring Manager at a top-tier tech company.
Your job is to conduct an exhaustive, HIGHLY PERSONALIZED technical interview evaluation for this candidate.

MOST IMPORTANT RULE: ALL TECHNICAL QUESTIONS MUST BE DIRECTLY TIED TO THE CANDIDATE'S ACTUAL RESUME, PROJECTS, AND SKILLS - not generic questions anyone could Google.

Candidate Profile:
---
Resume Content:
${resume || "Not provided"}

Self Description / Candidate Pitch:
${selfDescription || "Not provided"}

Target Job Requirements:
${jobDescription || "Not provided"}
---

CRITICAL INSTRUCTIONS:

1. TECHNICAL QUESTIONS - Generate EXACTLY 10-15 with this breakdown:

   CATEGORY: "project" (4-5 questions):
   - Read the candidate's ACTUAL projects from their resume carefully
   - Ask deep questions about SPECIFIC decisions in THOSE EXACT projects
   - Reference the actual project name/stack from their resume
   - Probe architecture decisions, performance choices, bugs faced, trade-offs
   - BAD: "How do you handle concurrent requests?" 
   - GOOD: "In your [ProjectName] built with [their stack], how did you handle [specific challenge from that domain]?"

   CATEGORY: "skill" (2-3 questions):
   - Reference technologies/skills EXPLICITLY listed on their resume
   - Go deep - ask about internals, edge cases, production scenarios
   - Not surface level definitions - probe real depth of knowledge

   CATEGORY: "job-description" (4-5 questions):
   - Focus on JD requirements NOT strongly evidenced in the resume
   - Bridge questions assessing readiness for new challenges
   - Be fair but thorough

2. ANSWER QUALITY - Each answer must be EXHAUSTIVE:
   - Minimum 4-6 substantial paragraphs per technical answer
   - Cover: theory -> implementation -> production gotchas -> trade-offs -> performance
   - Sound like real hands-on experience, not textbook definitions
   - Use specific numbers, examples, real-world scenarios

3. BEHAVIORAL QUESTIONS (4-6):
   - Real engineering situations: production incidents, cross-team conflicts, ownership, mentoring
   - Tailored to seniority level from resume
   - Full STAR format with quantifiable outcomes

4. SKILL GAPS & PREP PLAN:
   - Only genuine gaps between JD requirements and resume evidence
   - Honest severity: high=required+missing, medium=preferred+weak, low=nice-to-have
   - 5-7 day sprint prioritized by gap severity

A candidate reading these questions should IMMEDIATELY recognize they are about THEIR resume.`

    let lastError

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: process.env.GOOGLE_GENAI_MODEL || "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: z.toJSONSchema(interviewReportSchema)
                }
            })

            const report = JSON.parse(response.text)
            return interviewReportSchema.parse(report)
        } catch (error) {
            lastError = error
            console.error(`AI generation attempt ${attempt} failed:`, error?.message || error)
            if (!isTemporaryAiError(error) || attempt === 3) {
                break
            }
            await wait(1000 * attempt)
        }
    }

    const error = new Error("AI service is temporarily unavailable. Please try again in a minute.")
    error.statusCode = isTemporaryAiError(lastError) ? 503 : 500
    error.cause = lastError
    throw error
}

module.exports = generateInterviewReport
