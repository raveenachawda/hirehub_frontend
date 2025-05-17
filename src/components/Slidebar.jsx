import React, { useState } from "react";
import {
  Home,
  Briefcase,
  Search,
  FileText,
  User,
  LogOut,
  ListOrdered,
  MessageSquare,
  Send,
  X,
  Search as SearchIcon,
  Filter,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const Slidebar = ({ onMessageClick, onNotificationClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { allAppliedJobs } = useSelector((store) => store.job);
  const { allJobs } = useSelector((store) => store.job);

  // Calculate total notifications
  const totalNotifications =
    (allAppliedJobs?.length || 0) + (allJobs?.length || 0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Recruiter",
      content: "Your application has been received. We'll review it soon.",
      timestamp: "2024-03-20T10:30:00",
      unread: true,
      company: "Tech Corp",
      position: "Software Engineer",
    },
    {
      id: 2,
      sender: "You",
      content:
        "Thank you for the opportunity. I'm looking forward to hearing from you.",
      timestamp: "2024-03-20T11:15:00",
      unread: false,
      company: "Tech Corp",
      position: "Software Engineer",
    },
    {
      id: 3,
      sender: "HR Manager",
      content: "We would like to schedule an interview with you.",
      timestamp: "2024-03-21T09:00:00",
      unread: true,
      company: "Innovate Inc",
      position: "Frontend Developer",
    },
  ]);

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside
        className={`lg:w-64 w-64 bg-[#1e293b] min-h-screen shadow-md p-6 space-y-6 bg-gradient-to-bl fixed lg:relative transition-all duration-300 ${
          isOpen ? "block" : "lg:block hidden"
        }`}
      >
        <h2 className="text-3xl font-bold text-white mb-7 ml-5 mt-15">
          Candidate <span className="text-white">Dashboard</span>
        </h2>

        {/* Menu Buttons */}
        <Button
          className="w-full justify-start font-bold bg-[#1e293b] hover:bg-[#34495e]"
          onClick={() => navigate("/candidatedashboard")}
        >
          <Home size={18} /> Dashboard
        </Button>
        <Button
          className="w-full justify-start gap-2 hover:text-white bg-[#1e293b] hover:bg-[#34495e]"
          onClick={() => navigate("/candidatedashboard/jobs")}
        >
          <Briefcase size={18} /> Jobs
        </Button>

        <Button
          className="w-full justify-start font-bold bg-[#1e293b] hover:bg-[#34495e]"
          onClick={() => navigate("/candidatedashboard/latestjob")}
        >
          <ListOrdered size={18} /> LatestJobs
        </Button>

        <Button
          className="w-full justify-start font-bold bg-[#1e293b] hover:bg-[#34495e]"
          onClick={() => navigate("/candidatedashboard/profile")}
        >
          <User size={18} /> Profile
        </Button>

        

        
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          className="text-white bg-[#1e293b] p-4 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Search size={20} />
        </Button>
      </div>
    </>
  );
};

export default Slidebar;
