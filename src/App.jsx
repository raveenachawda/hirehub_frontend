import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Auth
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";

// General Pages
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import StepsSection from "./components/StepsSection";

// Admin
import Companies from "./components/admin/Companies";
import AdminJobs from "./components/admin/AdminJobs";
// Candidate
import CandidateDashboard from "./components/CandidateDashboard";
import AppliedJobs from "./components/AppliedJobTable";
import LatestJobs from "./components/LatestJobs";
import CandidateMainContent from "./components/CandidateMainContent";
import ContactUs from "./components/ContactUs";
import Homecontent from "./components/Homecontent";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import VerifyEmail from "./components/VerifyEmail";
import SavedJobs from "./components/SavedJobs";
import AdminDashboard from "./components/MainAdmin/AdminDashboard";
import CompanyDetails from "./components/admin/CompanyDetails";

// Main App Router
const appRouter = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Homecontent /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "jobs", element: <Jobs /> },
      { path: "description/:id", element: <JobDescription /> },
      { path: "browser", element: <Browse /> },
      { path: "profile", element: <Profile /> },
      { path: "aboutus", element: <StepsSection /> },
      { path: "contactus", element: <ContactUs /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "latestjob", element: <LatestJobs /> },
      {
        path: "/candidatedashboard/savedjobs",
        element: <SavedJobs />,
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin/companies",
    element: <Companies />,
  },

  {
    path: "/admin/jobs",
    element: <AdminJobs />,
  },
  {
    path: "/admin/jobs/create",
    element: <PostJob />,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <Applicants />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/companies/:companyId",
    element: <CompanyDetails />,
  },

  // Candidate Dashboard with Nested Routes
  {
    path: "/candidatedashboard",
    element: <CandidateDashboard />,
    children: [
      { index: true, element: <CandidateMainContent /> }, // Default dashboard view
      // { index: true, element: <LatestJobs /> }, // Default dashboard view
      { path: "jobs", element: <Jobs /> },
      { path: "browser", element: <Browse /> },
      { path: "profile", element: <Profile /> },
      { path: "appliedjobs", element: <AppliedJobs /> },
      { path: "latestjob", element: <LatestJobs /> },

      {
        path: "/candidatedashboard/savedjobs",
        element: <SavedJobs />,
      },
    ],
  },
]);
// recuriter

export default function App() {
  return <RouterProvider router={appRouter} />;
}
