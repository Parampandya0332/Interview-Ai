const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req,res){
    try{
        if(!req.file){
            return res.status(400).json({
                message:"Resume PDF is required"
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const {selfDescription,jobDescription} = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })
        
        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume:resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message:"Interview report genera ted successfully",
            interviewReport
        })
    }catch(error){
        res.status(error.statusCode || 500).json({
            message:error.message || "Unable to generate interview report"
        })
    }
}
module.exports = {generateInterviewReportController }
