import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Slidebar from "./Slidebar";
import { Outlet } from "react-router-dom";
import CandidateMainContent from "./CandidateMainContent";
import candidatedashboardImage from "../assets/candidatedashboardImage.jpg";

const CandidateDashboard = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${candidatedashboardImage})` }}
    >
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <Slidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
          {/* <CandidateMainContent/> */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CandidateDashboard;
