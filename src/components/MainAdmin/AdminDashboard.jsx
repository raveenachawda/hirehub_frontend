import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Bell,
  Calendar,
  BarChart2,
  Filter,
  Building2,
  Plus,
  MapPin,
  ArrowLeft,
  Loader2,
  Globe,
  User,
  MessageSquare,
} from "lucide-react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  COMPANY_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
  CONTACT_API_END_POINT,
  DASHBOARD_STATS_API_END_POINT,
} from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import CompaniesTable from "../admin/CompaniesTable";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { setUser } from "@/redux/authSlice";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    recruiters: 0,
    students: 0,
    jobs: 0,
    applications: 0,
    activeCompanies: 0,
    pendingApprovals: 0,
  });
  const [recruiters, setRecruiters] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "all",
    dateRange: "all",
    type: "all",
  });

  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companySetup, setCompanySetup] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [setupLoading, setSetupLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [showOnlyMessages, setShowOnlyMessages] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [createCompanyLoading, setCreateCompanyLoading] = useState(false);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const dispatch = useDispatch();
  const { singleCompany } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(DASHBOARD_STATS_API_END_POINT, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentJobs(response.data.recentJobs);
        setRecentApplications(response.data.recentApplications);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${COMPANY_API_END_POINT}/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch companies");
      toast.error(error.response?.data?.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyDeleted = (deletedCompanyId) => {
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => company._id !== deletedCompanyId)
    );
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (activeTab === "jobs") {
        setJobLoading(true);
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
            withCredentials: true,
          });
          if (res.data.success) {
            setJobs(res.data.jobs);
            dispatch(setAllAdminJobs(res.data.jobs));
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to fetch jobs");
        } finally {
          setJobLoading(false);
        }
      }
    };

    fetchJobs();
  }, [activeTab, dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (activeTab === "students") {
        setStudentLoading(true);
        try {
          const res = await axios.get(`${USER_API_END_POINT}/allstudents`, {
            withCredentials: true,
          });
          console.log("Students data received:", res.data);
          if (res.data.success) {
            setStudents(res.data.students);
            setStats((prev) => ({
              ...prev,
              students: res.data.students.length,
            }));
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          toast.error("Failed to fetch students");
        } finally {
          setStudentLoading(false);
        }
      }
    };

    fetchStudents();
  }, [activeTab]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      if (activeTab === "recruiters") {
        setRecruiterLoading(true);
        try {
          const res = await axios.get(`${USER_API_END_POINT}/allrecruiters`, {
            withCredentials: true,
          });
          console.log("Recruiters data received:", res.data);
          if (res.data.success) {
            setRecruiters(res.data.recruiters);
            setStats((prev) => ({
              ...prev,
              recruiters: res.data.recruiters.length,
            }));
          }
        } catch (error) {
          console.error("Error fetching recruiters:", error);
          toast.error("Failed to fetch recruiters");
        } finally {
          setRecruiterLoading(false);
        }
      }
    };

    fetchRecruiters();
  }, [activeTab]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (activeTab === "applications") {
        setApplicationLoading(true);
        try {
          const res = await axios.get(
            `${JOB_API_END_POINT}/application/applications/all`,
            {
              withCredentials: true,
            }
          );
          console.log("Applications data received:", res.data);
          if (res.data.success) {
            setApplications(res.data.applications);
            setStats((prev) => ({
              ...prev,
              applications: res.data.applications.length,
            }));
          }
        } catch (error) {
          console.error("Error fetching applications:", error);
          toast.error("Failed to fetch applications");
        } finally {
          setApplicationLoading(false);
        }
      }
    };

    fetchApplications();
  }, [activeTab]);

  useEffect(() => {
    const fetchContactMessages = async () => {
      if (activeTab === "messages") {
        setMessageLoading(true);
        try {
          const res = await axios.get(
            `${CONTACT_API_END_POINT}/contact-messages`,
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            setContactMessages(res.data.messages);
          }
        } catch (error) {
          console.error("Error fetching contact messages:", error);
          toast.error("Failed to fetch contact messages");
        } finally {
          setMessageLoading(false);
        }
      }
    };

    fetchContactMessages();
  }, [activeTab]);

  const navItems = [
    { id: "dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
    { id: "recruiters", icon: <Users size={20} />, label: "Recruiters" },
    { id: "students", icon: <Users size={20} />, label: "Candidates" },
    { id: "jobs", icon: <Briefcase size={20} />, label: "Jobs" },
    { id: "companies", icon: <Building2 size={20} />, label: "Companies" },
    {
      id: "messages",
      icon: <MessageSquare size={20} />,
      label: "Messages",
      onClick: () => {
        setShowOnlyMessages(true);
        setActiveTab("messages");
      },
    },
    {
      id: "company-setup",
      icon: <Settings size={20} />,
      label: "Company Setup",
    },
    { id: "profile", icon: <User size={20} />, label: "My Profile" },
  ];

  const handleStatCardClick = (tab) => {
    setActiveTab(tab);
  };

  const handleVerifyStudent = async (studentId) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/block/${studentId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setStudents(
          students.map((student) =>
            student._id === studentId
              ? { ...student, status: "verified" }
              : student
          )
        );
        toast.success("Student verified successfully");
      }
    } catch (error) {
      console.error("Error verifying student:", error);
      toast.error(error.response?.data?.message || "Failed to verify student");
    }
  };

  const handleBlockStudent = async (studentId) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/block/${studentId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setStudents(
          students.map((student) =>
            student._id === studentId
              ? { ...student, status: "blocked" }
              : student
          )
        );
        toast.success("Student status updated successfully");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update student status"
      );
    }
  };

  const handleDeleteRecruiter = (id) => {
    setRecruiters(recruiters.filter((recruiter) => recruiter.id !== id));
    setStats((prev) => ({ ...prev, recruiters: prev.recruiters - 1 }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterChange = (filterType, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    try {
      setCreateCompanyLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: newCompanyName.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        setShowCreateCompanyModal(false);
        setNewCompanyName("");
        setActiveTab("company-setup");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(error.response?.data?.message || "Error creating company");
    } finally {
      setCreateCompanyLoading(false);
    }
  };

  const handleCompanySetup = async (e) => {
    e.preventDefault();
    setSetupLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", companySetup.name);
      formData.append("description", companySetup.description);
      formData.append("website", companySetup.website);
      formData.append("location", companySetup.location);
      if (companySetup.file) {
        formData.append("file", companySetup.file);
      }

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${singleCompany._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setActiveTab("companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error updating company");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleCompanySetupChange = (e) => {
    setCompanySetup({ ...companySetup, [e.target.name]: e.target.value });
  };

  const handleCompanyFileChange = (e) => {
    const file = e.target.files?.[0];
    setCompanySetup({ ...companySetup, file });
  };

  useEffect(() => {
    if (singleCompany) {
      setCompanySetup({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.file || null,
      });
    }
  }, [singleCompany]);

  const handleDeleteCompany = async (companyId) => {
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setCompanies(companies.filter((company) => company._id !== companyId));
        toast.success("Company deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  const handleEditCompany = (company) => {
    dispatch(setSingleCompany(company));
    setCompanySetup({
      name: company.name || "",
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
      file: null,
    });
    setActiveTab("company-setup");
  };

  const handleVerifyRecruiter = async (recruiterId) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/block/${recruiterId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setRecruiters(
          recruiters.map((recruiter) =>
            recruiter._id === recruiterId
              ? { ...recruiter, status: "verified" }
              : recruiter
          )
        );
        toast.success("Recruiter verified successfully");
      }
    } catch (error) {
      console.error("Error verifying recruiter:", error);
      toast.error(
        error.response?.data?.message || "Failed to verify recruiter"
      );
    }
  };

  const handleBlockRecruiter = async (recruiterId) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/block/${recruiterId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setRecruiters(
          recruiters.map((recruiter) =>
            recruiter._id === recruiterId
              ? { ...recruiter, status: "blocked" }
              : recruiter
          )
        );
        toast.success("Recruiter status updated successfully");
      }
    } catch (error) {
      console.error("Error updating recruiter status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update recruiter status"
      );
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        // Remove the job from the Redux store
        const updatedJobs = jobs.filter((job) => job._id !== jobId);
        setJobs(updatedJobs);
        dispatch(setAllAdminJobs(updatedJobs));
        toast.success("Job deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleReply = async (messageId, email) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setReplyLoading(true);
    try {
      const res = await axios.post(
        `${CONTACT_API_END_POINT}/reply`,
        {
          messageId,
          email,
          reply: replyMessage,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Reply sent successfully");
        setReplyMessage("");
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await axios.delete(
        `${CONTACT_API_END_POINT}/delete/${messageId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setContactMessages(
          contactMessages.filter((msg) => msg._id !== messageId)
        );
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Recruiters"
            value={stats.recruiters}
            icon="👥"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Students"
            value={stats.students}
            icon="🎓"
            color="bg-green-500"
          />
          <StatCard
            title="Total Jobs"
            value={stats.jobs}
            icon="💼"
            color="bg-purple-500"
          />
          <StatCard
            title="Total Applications"
            value={stats.applications}
            icon="📝"
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Companies"
            value={stats.activeCompanies}
            icon="🏢"
            color="bg-indigo-500"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon="⏳"
            color="bg-red-500"
          />
        </div>

        {/* Recent Jobs and Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4">{job.type}</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{app.candidate}</h4>
                      <p className="text-sm text-gray-600">{app.job}</p>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(app.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs Management</h2>
      </div>

      {jobLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {job.company?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded transition"
                          style={{
                            outline: "none",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 className="w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidates Management</h2>
      </div>

      {studentLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : student.status === "blocked"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {student.status !== "verified" && (
                        <button
                          onClick={() => handleVerifyStudent(student._id)}
                          className="text-green-600 hover:text-green-800 mr-4"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleBlockStudent(student._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {student.status === "blocked" ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecruitersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recruiters Management</h2>
      </div>

      {recruiterLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recruiters.map((recruiter) => (
                  <tr key={recruiter._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {recruiter.fullname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {recruiter.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {recruiter.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          recruiter.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : recruiter.status === "blocked"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {recruiter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(recruiter.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {recruiter.status !== "verified" && (
                        <button
                          onClick={() => handleVerifyRecruiter(recruiter._id)}
                          className="text-green-600 hover:text-green-800 mr-4"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleBlockRecruiter(recruiter._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {recruiter.status === "blocked" ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderApplicationsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications Management</h2>
      </div>

      {applicationLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.studentEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.jobTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {application.resume && (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          View Resume
                        </a>
                      )}
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleUpdateApplicationStatus(
                            application._id,
                            e.target.value
                          )
                        }
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessagesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      {messageLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.map((message) => (
            <div
              key={message._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#ffe5e0] flex items-center justify-center">
                    <span className="text-[#ff6b6b] text-xl font-medium">
                      {message.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{message.name}</h3>
                    <p className="text-sm text-gray-500">{message.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="p-2 text-[#ff6b6b] hover:bg-gray-100 rounded-lg"
                    title="Reply"
                  ></button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this message?"
                        )
                      ) {
                        handleDeleteMessage(message._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-gray-100 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#ffe5e0] flex items-center justify-center">
                  <span className="text-[#ff6b6b] text-xl font-medium">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                  <p className="text-gray-500">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Original Message:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Reply:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="4"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                  placeholder="Type your reply..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleReply(selectedMessage._id, selectedMessage.email)
                  }
                  disabled={replyLoading}
                  className={`px-4 py-2 bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252] ${
                    replyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {replyLoading ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfileContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"></div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-6">
            <div className="h-32 w-32 rounded-full bg-[#ffe5e0] flex items-center justify-center overflow-hidden">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#ff6b6b] text-4xl font-medium">
                  {user?.fullname?.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{user?.fullname}</h3>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <p
                    className={`font-medium ${
                      user?.isVerified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {user?.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Account Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(user?.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-600">{user?._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateCompanyModal = () => (
    <Dialog
      open={showCreateCompanyModal}
      onOpenChange={setShowCreateCompanyModal}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateCompanyModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCompanyLoading}
              className="bg-black hover:bg-[#F83002] text-white"
            >
              {createCompanyLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Company"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]">
      <Navbar />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`bg-[#1e293b] -mt-3.5 text-white ${
            sidebarOpen ? "w-64" : "w-20"
          } transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 flex items-center justify-between border-b mt-2 border-[#ffe5e0]">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold">HireHub Admin</h1>
            ) : (
              <h1 className="text-xl font-bold">HH</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-[#ffe5e0]"
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          <nav className="flex-1 p-2">
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setActiveTab(item.id);
                        setShowOnlyMessages(false);
                      }
                    }}
                    className={`flex items-center w-full p-3 rounded-lg mb-1 ${
                      activeTab === item.id
                        ? "bg-[#ffe5e0] text-black"
                        : "hover:bg-gray-500"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-[#ffe5e0]">
            <button
              className="flex items-center text-red-100 hover:text-white"
              onClick={() => {
                localStorage.clear();
                dispatch(setUser(null));
                navigate("/login");
              }}
            >
              <LogOut size={20} className="mr-3" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 -mt-4 overflow-auto">
          {!showOnlyMessages && (
            <header className="shadow-sm p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold italic text-gray-800">
                  {navItems.find((item) => item.id === activeTab)?.label ||
                    "Dashboard"}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-[#ffe5e0] font-medium">AD</span>
                  </div>
                </div>
              </div>
            </header>
          )}

          <main className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === "dashboard" &&
                  !showOnlyMessages &&
                  renderDashboardContent()}
                {activeTab === "jobs" &&
                  !showOnlyMessages &&
                  renderJobsContent()}
                {activeTab === "students" &&
                  !showOnlyMessages &&
                  renderStudentsContent()}
                {activeTab === "recruiters" &&
                  !showOnlyMessages &&
                  renderRecruitersContent()}
                {activeTab === "applications" &&
                  !showOnlyMessages &&
                  renderApplicationsContent()}
                {activeTab === "messages" && renderMessagesContent()}
                {activeTab === "profile" &&
                  !showOnlyMessages &&
                  renderProfileContent()}
                {activeTab === "companies" && !showOnlyMessages && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Companies</h2>
                      <Button
                        onClick={() => setShowCreateCompanyModal(true)}
                        className="bg-[#ff5a3a] hover:bg-[#ff6b6b] text-white"
                      >
                        Add New Company
                      </Button>
                    </div>

                    {companyLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                          <div
                            key={company._id}
                            className="bg-white rounded-lg shadow p-6"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                {company.logo ? (
                                  <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {company.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {company.location}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditCompany(company)}
                                  className="p-2 text-[#ff6b6b] hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this company?"
                                      )
                                    ) {
                                      handleDeleteCompany(company._id);
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-gray-100 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {company.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-[#ff6b6b]"
                              >
                                <Globe size={16} /> Website
                              </a>
                              <div className="flex items-center gap-1">
                                <MapPin size={16} /> {company.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "company-setup" && !showOnlyMessages && (
                  <div className="flex flex-col items-center min-h-[60vh] w-full">
                    <h1 className="text-4xl font-bold mb-8 mt-4 text-center">
                      Company Setup
                    </h1>
                    <div className="bg-white rounded-2xl shadow p-8 max-w-2xl w-full flex flex-col">
                      <button
                        className="mb-6 w-fit flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                        onClick={() => setActiveTab("companies")}
                      >
                        <ArrowLeft size={18} /> Back
                      </button>
                      <form
                        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
                        onSubmit={handleCompanySetup}
                      >
                        <div>
                          <label className="block font-semibold mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                            placeholder="Company Name"
                            value={companySetup.name}
                            onChange={handleCompanySetupChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            name="description"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                            placeholder="Description"
                            value={companySetup.description}
                            onChange={handleCompanySetupChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                            placeholder="https://company.com"
                            value={companySetup.website}
                            onChange={handleCompanySetupChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                            placeholder="Location"
                            value={companySetup.location}
                            onChange={handleCompanySetupChange}
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold mb-2">
                            Logo
                          </label>
                          <input
                            type="file"
                            name="file"
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            onChange={handleCompanyFileChange}
                            accept="image/*"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                          {setupLoading ? (
                            <button
                              type="button"
                              disabled
                              className="w-full md:w-1/3 px-6 py-3 rounded-lg bg-gray-400 text-white font-semibold mt-4 flex items-center justify-center"
                            >
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Updating...
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="w-full md:w-1/3 px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 mt-4"
                            >
                              Update Company
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      {renderCreateCompanyModal()}
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-full`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { color: "green", text: "Active" },
    verified: { color: "blue", text: "Verified" },
    pending: { color: "yellow", text: "Pending" },
    blocked: { color: "red", text: "Blocked" },
    reviewed: { color: "purple", text: "Reviewed" },
  };

  const config = statusConfig[status] || { color: "gray", text: "Unknown" };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full bg-${config.color}-100 text-${config.color}-800`}
    >
      {config.text}
    </span>
  );
};

const TableSection = ({ title, data, columns, emptyMessage, renderRow }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border rounded-md text-sm flex items-center">
          <Filter size={16} className="mr-1" /> Filter
        </button>
        <button className="px-3 py-1 border rounded-md text-sm flex items-center">
          <ChevronDown size={16} className="mr-1" /> Export
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
