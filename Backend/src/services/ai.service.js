const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")

const ai = new GoogleGenAI({
    apiKey:  process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore:z.number().describe("A score between 0 to 100 indicating hoe well the candidate's profile"),
    technicalQuestions:z.array(z.object({
        question:z.string().describe("The Tecnical question can be asked in the INTERVIEW"),
        intention:z.string().describe("The Intention of interviewer being asked this question "),
        answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions:z.array(z.object({
        question:z.string().describe("The Tecnical question can be asked in the INTERVIEW"),
        intention:z.string().describe("The Intention of interviewer being asked this question "),
        answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
    })).describe("Behavioral question that can be asked in the interview along with their intention and how to answer them"),
    skillGaps:z.array(z.object({
        skill:z.string().describe("The skills which the candidate is lacking"),
        severity:z.enum(["low","medium","high"]).describe("the severity of the skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preperationPlan:z.array(z.object({
        day:z.number().describe("The day number in the preperation plan,start from 1"),
        focus:z.string().describe("The focus area for this day's preparation"),
        tasks:z.array(z.string()).describe("Concrete tasks to complete on this day")
    })).describe("Day-wise preparation plan for the interview")
})

function isTemporaryAiError(error){
    const status = error?.status || error?.code || error?.error?.code
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateInterviewReport({resume,selfDescription,jobDescription}){
    const prompt = `Generate an interview Report for a candidate with the following 
                    Details
                    Resume: ${resume},
                    Self describe: ${selfDescription},
                    Job describe : ${jobDescription}`
    let lastError

    for(let attempt = 1; attempt <= 3; attempt++){
        try{
            const response = await ai.models.generateContent({
                model: process.env.GOOGLE_GENAI_MODEL || "gemini-2.5-flash",
                contents:prompt,  
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: z.toJSONSchema(interviewReportSchema)
                }
            })

            const report = JSON.parse(response.text)
            return interviewReportSchema.parse(report)
        }catch(error){
            lastError = error
            if(!isTemporaryAiError(error) || attempt === 3){
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
