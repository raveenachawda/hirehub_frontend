import React, { useEffect, useState, useRef } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useGetJoinedCompanies from "@/hooks/useGetJoinedCompanies";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchCompanyByText,
  setJoinedCompanies,
} from "@/redux/companySlice";
import { toast } from "sonner";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Building2,
  Users,
  Briefcase,
  ArrowUpDown,
  Home,
  UserCog,
  GraduationCap,
  NotebookText,
  Building,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  Send,
} from "lucide-react";
import AdminJobsTable from "./AdminJobsTable";
import ApplicantsTable from "./ApplicantsTable ";
import { setUser } from "@/redux/authSlice";

const Companies = () => {
  useGetAllCompanies();
  useGetJoinedCompanies();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const { companies = [], joinedCompanies = [] } = useSelector(
    (store) => store.company
  );
  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hello, I'm interested in the job posting.",
      timestamp: "2024-03-20T10:30:00",
      unread: true,
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Thank you for your application. We'll review it soon.",
      timestamp: "2024-03-20T11:15:00",
      unread: false,
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  // Add welcome animation effect
  useEffect(() => {
    setWelcomeVisible(false);
    const timer = setTimeout(() => {
      setWelcomeVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const navigate = useNavigate();

  const handleJoinCompany = async (companyId) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/join/${companyId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const joinedRes = await axios.get(
          `${COMPANY_API_END_POINT}/joined`,
          {
            withCredentials: true,
          }
        );
        if (joinedRes.data.success) {
          console.log(joinedRes.data.companies);  
          dispatch(setJoinedCompanies(joinedRes.data.companies));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error joining company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortCompanies = (companies) => {
    return [...companies].sort((a, b) => {
      const aValue = a[sortBy]?.toLowerCase() || "";
      const bValue = b[sortBy]?.toLowerCase() || "";
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const filterCompanies = (companies) => {
    return companies.filter((company) => {
      const matchesSearch = company?.name
        ?.toLowerCase()
        .includes(input.toLowerCase());
      const matchesIndustry =
        industryFilter === "all" || company?.industry === industryFilter;
      return matchesSearch && matchesIndustry;
    });
  };

  const filteredCompanies = filterCompanies(companies);
  const filteredJoinedCompanies = filterCompanies(joinedCompanies);

  const sortedFilteredCompanies = sortCompanies(filteredCompanies);
  const sortedFilteredJoinedCompanies = sortCompanies(filteredJoinedCompanies);

  // Calculate statistics
  const totalCompanies = companies.length;
  const totalJoinedCompanies = joinedCompanies.length;

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/admin/companies" },
    { name: "My Profile", icon: UserCog, path: "/recruiter/profile" },
    { name: "Applications", icon: UserCog, path: "/recruiter/applications" },
    {
      name: "Company Detail",
      icon: NotebookText,
      path: "/recruiter/companiesdetails",
      onClick: () => setActiveTab("company-detail"),
    },

    // { name: "Recruiters", icon: UserCog, path: "/recruiter/recruiters" },
    // { name: "Candidates", icon: GraduationCap, path: "/recruiter/students" },
    // { name: "Posted Jobs", icon: NotebookText, path: "/recruiter/jobs" },
  ];

  const companiesSectionRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toISOString(),
        unread: false,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)] flex">
        {/* Sidebar */}
        <div
          className={`bg-[#1e293b] shadow-md -mt-3.5 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          } flex-shrink-0`}
        >
          <div className="p-4 border-b  flex items-center justify-between">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold  text-white">HireHub</h1>
            ) : (
              <h1 className="text-xl font-bold text-white">HH</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>
          <div
            className="p-2 flex flex-col h-full justify-between"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <div>
              <h2
                className={`px-4 py-2 text-xl  font-bold text-white ${
                  sidebarOpen ? "" : "hidden"
                }`}
              >
                HireHub Recuriter
              </h2>
              <nav className="mt-2 ">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() =>
                      setActiveTab(item.name.toLowerCase().replace(/ /g, "-"))
                    }
                    className={`flex items-center w-full px-4 py-4 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.name.toLowerCase().replace(/ /g, "-")
                        ? "bg-[#ffe5e0] text-[#ff6b4a]"
                        : "text-white hover:bg-gray-400"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-white">
              <button
                className="flex items-center text-white font-bold hover:text-white hover:bg-gray-500 rounded-2xl p-4 w-full"
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
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {activeTab === "message" ? (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-2xl font-bold mb-6">Messages</h2>
                  <div className="grid grid-cols-12 gap-4 h-[600px]">
                    {/* Message List */}
                    <div className="col-span-4 border-r pr-4 overflow-y-auto">
                      <div className="space-y-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            onClick={() => setSelectedMessage(message)}
                            className={`p-3 rounded-lg cursor-pointer transition ${
                              selectedMessage?.id === message.id
                                ? "bg-[#ffe5e0]"
                                : "hover:bg-gray-100"
                            } ${message.unread ? "font-semibold" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium">
                                {message.sender}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="col-span-8 flex flex-col">
                      {selectedMessage ? (
                        <>
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="bg-[#ffe5e0] p-4 rounded-lg max-w-[80%]">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  {selectedMessage.sender}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    selectedMessage.timestamp
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700">
                                {selectedMessage.content}
                              </p>
                            </div>
                          </div>
                          <div className="border-t p-4">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F83002]"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") handleSendMessage();
                                }}
                              />
                              <button
                                onClick={handleSendMessage}
                                className="bg-[#F83002] text-white px-4 py-2 rounded-lg hover:bg-[#ff5a3a] transition-colors"
                              >
                                <Send size={20} />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                          Select a message to view
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeTab === "my-profile" ? (
                <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto mt-10">
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    My Profile
                  </h2>
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-[#ffe5e0] flex items-center justify-center overflow-hidden mb-4">
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
                    <h3 className="text-xl font-semibold mb-2">
                      {user?.fullname}
                    </h3>
                    <p className="text-gray-600 mb-4">{user?.email}</p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{user?.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Verification Status
                        </p>
                        <p
                          className={`font-medium ${
                            user?.isVerified
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {user?.isVerified ? "Verified" : "Not Verified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">
                          {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium text-gray-600">{user?._id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "applications" ? (
                <div className="bg-white rounded-xl shadow p-8 max-w-5xl mx-auto mt-10">
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    All Applicants
                  </h2>
                  <ApplicantsTable />
                </div>
              ) : activeTab === "company-detail" ? (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    Company Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {joinedCompanies.map((company) => (
                      <div
                        key={company._id}
                        className="bg-gray-50 rounded-lg p-6 shadow-sm"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-16 w-16 rounded-full bg-[#ffe5e0] flex items-center justify-center">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-[#ff6b6b] text-2xl font-medium">
                                {company.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {company.name}
                            </h3>
                            <p className="text-gray-600">{company.industry}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {company.location || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Website</p>
                            <p className="font-medium">
                              {company.website ? (
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {company.website}
                                </a>
                              ) : (
                                "Not specified"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="font-medium">
                              {company.description ||
                                "No description available"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Founded</p>
                            <p className="font-medium">
                              {company.foundedYear || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Company Size
                            </p>
                            <p className="font-medium">
                              {company.companySize || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {joinedCompanies.length === 0 && (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-gray-500">
                          You haven't joined any companies yet.
                        </p>
                        <Button
                          onClick={() => setActiveTab("all")}
                          className="mt-4 bg-[#1e293b] hover:bg-[#ff5a3a]"
                        >
                          Browse Companies
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h1
                    className={`text-3xl font-bold italic text-gray-600 mb-6 transition-opacity duration-500 ${
                      welcomeVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animation: welcomeVisible
                        ? "fadeIn 0.5s ease-in-out, bounce 0.5s ease-in-out 0.5s"
                        : "none",
                    }}
                  >
                    Welcome {user?.fullname}
                  </h1>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    <div
                      className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        setActiveTab("all");
                        companiesSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <Building2 className="w-8 h-8 text-blue-500 -mt-18.5" />
                        <div>
                          <h2 className="text-xl font-semibold mb-1">
                            Total Companies
                          </h2>

                          <p className="text-2xl font-bold text-gray-800">
                            {totalCompanies}
                          </p>
                          <Button className="bg-[#1e293b] mt-5 hover:bg-[#ff5a3a]">
                            Total Companies
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <Users className="w-8 h-8 text-green-500 -mt-18.5" />
                        <div>
                          <h2 className="text-lg font-semibold mb-1">
                            Joined Company
                          </h2>
                          <p className="text-xl font-bold text-gray-800">
                            {totalJoinedCompanies}
                          </p>
                          <Button
                            className="bg-[#1e293b] mt-5 hover:bg-[#ff5a3a]"
                            onClick={() => {
                              setActiveTab("joined");
                              companiesSectionRef.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                          >
                            Joined Company
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <Briefcase className="w-8 h-8 text-purple-500 -mt-18.5" />
                        <div>
                          <h2 className="text-lg font-semibold mb-1">
                            Posted Jobs
                          </h2>
                          <p className="text-xl font-bold text-gray-800">
                            {allAdminJobs.length}
                          </p>
                          <Button
                            className="bg-[#1e293b] mt-5 hover:bg-[#ff5a3a]"
                            onClick={() => {
                              setActiveTab("posted");
                              companiesSectionRef.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                          >
                            Posted Jobs
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                      <h2 className="text-lg font-semibold mb-2">
                        Manage Jobs
                      </h2>
                      <p className="text-gray-600 mb-4 text-sm">
                        Add or edit job listings posted by the company.
                      </p>
                      <Button
                        onClick={() => navigate("/admin/jobs")}
                        className="bg-[#1e293b] hover:bg-[#ff5a3a]"
                      >
                        Manage Jobs
                      </Button>
                    </div>
                  </div>

                  {/* Recent Activity Section */}

                  {/* Companies Section */}
                  <div
                    className="bg-white rounded-xl  shadow p-6"
                    ref={companiesSectionRef}
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                      <h2 className="text-lg font-semibold">Companies</h2>
                      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <Input
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full md:w-64 hover:border-2 hover:border-black"
                          placeholder="Filter by company name"
                        />
                      </div>
                    </div>

                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full "
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger
                          value="all"
                          onClick={() => setActiveTab("all")}
                        >
                          All Companies
                        </TabsTrigger>
                        <TabsTrigger
                          value="joined"
                          onClick={() => setActiveTab("joined")}
                        >
                          Joined Companies
                        </TabsTrigger>
                        <TabsTrigger
                          value="posted"
                          onClick={() => setActiveTab("posted")}
                        >
                          Posted Jobs
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all">
                        <CompaniesTable
                          companies={sortedFilteredCompanies}
                          onJoinCompany={handleJoinCompany}
                          showJoinButton={true}
                          isLoading={isLoading}
                        />
                      </TabsContent>

                      <TabsContent value="joined">
                        <CompaniesTable
                          companies={sortedFilteredJoinedCompanies}
                          showJoinButton={false}
                          isLoading={isLoading}
                        />
                      </TabsContent>

                      <TabsContent value="posted">
                        <AdminJobsTable />
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Companies;
