import axios from "axios";

// VITE_API_URL may point to `/api/auth` for the auth client or to the
// backend origin. Interview endpoints share the same server, under `/api/interview`.
const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const backendBaseUrl = configuredApiUrl
    .replace(/\/api\/auth\/?$/, "")
    .replace(/\/$/, "");

const api = axios.create({
    baseURL: `${backendBaseUrl}/api/interview`,
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

    // Keep the URL at /api/interview without a trailing slash. The Vercel
    // rewrite forwards that route, while /api/interview/ currently returns 404.
    const response = await api.post("", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
