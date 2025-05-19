const BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const Application_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const CONTACT_API_END_POINT = `${BASE_URL}/api/v1/contact`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const DASHBOARD_STATS_API_END_POINT = `${BASE_URL}/api/v1/user/dashboard-stats`;
