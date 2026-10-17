import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/interview`,
    withCredentials: true,
});

/**
 * Generate an AI interview report using resume PDF, job description, and self description
 * @param {Object} params
 * @param {File} params.resumeFile
 * @param {string} params.selfDescription
 * @param {string} params.jobDescription
 */
export async function generateInterviewReport({ resumeFile, selfDescription, jobDescription }) {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription || "");
    formData.append("jobDescription", jobDescription || "");

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
