const mongoose = require("mongoose");

/**
 * job description: This is the schema for the job model
 * -resume text
 * -self Description text-string
 *- match Score : number
 * -Technical Questions and answers:[{
 *                                   question: "--------------",
 *                                   answer: "----------------"
 *                                   intention: "----------------"
 *                                   }]
 * -Behavioural Questions and answers:[{
 *                                   question: "--------------",
 *                                   answer: "----------------"
 *                                   intention: "----------------"
 *                                   }]
 * -skill gaps :[{
 *                                 skill: "--------------",severity: "----------------"
 *                                 type: string ,enum: ["low","medium","high"]
 *                                 }]
 * -feedback :[{
 *                                 feedback: "--------------",severity: "----------------"
 *                                 type: string ,enum: ["low","medium","high"]
 *                                 }]
 * -prepartion plan   :[{day- number,focus_area - string , task - string}]
*/

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"technical questions are required "]
    },
    intention:{
        type:String,
        required: [true,"Intention is required"]
    },
    answer:{
        type: String,
        required:[true,"Answer is required"]
    }

},{
    _id : false
}
)

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"technical questions are required "]
    },
    intention:{
        type:String,
        required: [true,"Intention is required"]
    },
    answer:{
        type: String,
        required:[true,"Answer is required"]
    }

},{
    _id : false
}
)

const skillGapSchema =  new mongoose.Schema({
    skill:{
        type : String,
        required : [ true,"Skill is Required"]
    },
    severity:{
        type : String,
        enum : ["low","medium","high"],
        required : [true,"Severity is required"]
    }
},{
    _id : false
})

const preperationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required :[true,"Day is required"]
    },
    focus:{
        type : String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type: String,
        required:[true,"Tasks is required"]
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions :[behavioralQuestionSchema],
    skillGaps :[skillGapSchema],
    preperationPlan:[preperationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users "
    }
    
},{
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema);

module.exports = interviewReportModel;
