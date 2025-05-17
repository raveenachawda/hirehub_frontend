import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Skills from "./Skills";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Trash2 } from "lucide-react";

const CandidateMainContent = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { allAppliedJobs } = useSelector((store) => store.job);
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  // Add new state for read notifications
  const [readNotifications, setReadNotifications] = useState(new Set());

  // Get notifications from Redux store
  const reduxNotifications = useSelector(
    (store) => store.notification?.notifications || []
  );

  // Use useMemo to compute notifications without causing re-renders
  const notifications = useMemo(() => {
    if (!allJobs || !user?._id) return reduxNotifications;

    // Get the latest jobs (posted in the last 24 hours)
    const recentJobs = allJobs.filter((job) => {
      const jobDate = new Date(job.createdAt);
      const now = new Date();
      const diffHours = (now - jobDate) / (1000 * 60 * 60);
      return diffHours <= 24;
    });

    // Create notifications for new jobs
    const newJobNotifications = recentJobs.map((job) => ({
      id: `job-${job._id}`,
      type: "new_job",
      message: `New job posted: ${job.title} at ${
        job.company?.name || "Company"
      }`,
      timestamp: job.createdAt,
      read: false,
      userId: user._id,
      jobId: job._id,
    }));

    // Create notifications for application status updates
    const applicationNotifications = allAppliedJobs
      .filter((application) => {
        // Only show notifications for applications with status updates in the last 24 hours
        const updateDate = new Date(application.updatedAt);
        const now = new Date();
        const diffHours = (now - updateDate) / (1000 * 60 * 60);
        return diffHours <= 24 && application.status !== "pending";
      })
      .map((application) => ({
        id: `application-${application._id}`,
        type: "application_status",
        status: application.status,
        message:
          application.status === "accepted"
            ? `Congratulations! Your application for ${
                application.job?.title || "the position"
              } at ${
                application.job?.company?.name || "the company"
              } has been accepted!`
            : `Your application for ${
                application.job?.title || "the position"
              } at ${
                application.job?.company?.name || "the company"
              } was not selected.`,
        timestamp: application.updatedAt,
        read: false,
        userId: user._id,
        applicationId: application._id,
      }));

    // Combine all notifications
    return [
      ...reduxNotifications,
      ...newJobNotifications,
      ...applicationNotifications,
    ];
  }, [allJobs, reduxNotifications, user?._id, allAppliedJobs]);

  // Filter notifications for this user
  const userNotifications = useMemo(
    () =>
      notifications.filter((notification) => notification.userId === user?._id),
    [notifications, user?._id]
  );

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = useMemo(
    () =>
      [...userNotifications].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    [userNotifications]
  );

  // Count unread notifications
  const unreadCount = useMemo(
    () =>
      sortedNotifications.filter((notification) => !notification.read).length,
    [sortedNotifications]
  );

  // Function to mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setReadNotifications((prev) => new Set([...prev, notificationId]));
  };

  // Function to close notification
  const handleCloseNotification = (e) => {
    e.stopPropagation();
    setShowNotifications(false);
  };

  const handleSavedJobsClick = () => {
    navigate("/candidatedashboard/savedjobs");
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationAction = (notification) => {
    // Handle different notification types
    switch (notification.type) {
      case "application_status":
        navigate(`/candidatedashboard/appliedjobs`);
        break;
      case "new_job":
        // Navigate to the specific job if jobId is available
        if (notification.jobId) {
          navigate(`/candidatedashboard/jobs/${notification.jobId}`);
        } else {
          navigate(`/candidatedashboard/jobs`);
        }
        break;
      default:
        break;
    }
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering the notification click
    // Here you would dispatch an action to remove the notification
    // For example:
    // dispatch(deleteNotification(notificationId));
    console.log("Deleting notification:", notificationId);
  };

  console.log("Redux notifications:", reduxNotifications);
  console.log("Derived notifications:", notifications);
  console.log("User notifications:", userNotifications);
  console.log("Sorted notifications:", sortedNotifications);
  console.log("User:", user);

  return (
    <>
      {/* Welcome Message */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-9 px-6 ">
        {/* Left Section */}

        <div className="flex-1 pr-6 pl-25 mt-39">
          <h2 className="text-4xl font-bold italic mb-4 text-center text-shadow-md">
            Welcome <span className="text-[#F83002]">Back</span>!
          </h2>
          <h2 className="text-2xl font-bold text-black text-center mb-7 text-shadow-md">
            Candidate sourcing Platform
          </h2>
          <p className="text-gray-600 italic text-center">
            Explore job opportunities, track your applications, and manage your
            profile all in one place.
          </p>
        </div>

        {/* Right Profile Card */}
        <div className="w-full lg:w-[360px] py-2 pl-6 lg:pl-28">
          <div className="bg-[#121e36] h-[400px] w-full text-white rounded-2xl py-10 shadow-xl p-6">
            <div className="flex flex-col items-center mb-4 space-y-2">
              <img
                src={
                  user?.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <h3 className="text-xl font-bold">{user?.fullname || "User"}</h3>
              <span className="text-sm text-gray-300">Candidate</span>
              <Skills />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 pt-10 mr-38 w-[1000px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
        {/* Applied Jobs */}
        <div
          className="bg-[#f96746] text-white p-6 rounded-2xl shadow-lg text-center cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/candidatedashboard/appliedjobs")}
        >
          <h4 className="text-3xl font-bold">{allAppliedJobs?.length || 0}</h4>
          <Button
            className="bg-[#f96746] hover:bg-[#f96746] border-none text-xl font-semibold mt-2"
            onClick={() => navigate("/candidatedashboard/appliedjobs")}
          >
            Applied Jobs
          </Button>
        </div>

        {/* Saved Jobs */}
        <div
          className="bg-black text-white p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition"
          onClick={handleSavedJobsClick}
        >
          <h4 className="text-3xl font-bold mb-2">{savedJobs?.length || 0}</h4>
          <p
            className="text-xl font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleSavedJobsClick();
            }}
          >
            Saved Jobs
          </p>
        </div>

        {/* Uploaded Resume */}
        <div
          className={`${
            user?.profile?.resume ? "bg-green-100" : "bg-red-100"
          } p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition cursor-pointer`}
          onClick={() => {
            if (user?.profile?.resume) {
              window.open(user.profile.resume, "_blank");
            }
          }}
        >
          <h4 className="text-2xl font-bold mb-2">
            {user?.profile?.resume ? "Uploaded" : "Not Uploaded"}
          </h4>
          <p className="text-xl font-semibold">Resume</p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <div
            className="bg-blue-200 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition cursor-pointer"
            onClick={handleNotificationClick}
          >
            <div className="flex items-center justify-center gap-2">
              <Bell className="w-6 h-6" />
              <h4 className="text-3xl font-bold">{unreadCount}</h4>
            </div>
            <p className="text-xl font-semibold">Notifications</p>
          </div>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="fixed top-20 right-4 w-96 bg-white rounded-lg shadow-xl z-[1000] max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <button
                    onClick={handleCloseNotification}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                {sortedNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {sortedNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg cursor-pointer transition ${
                          readNotifications.has(notification.id)
                            ? "bg-gray-50 opacity-60"
                            : "bg-blue-50"
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {notification.type === "application_status" && (
                                <span
                                  className={`font-bold ${
                                    notification.status === "accepted"
                                      ? "text-green-600"
                                      : notification.status === "rejected"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {notification.status === "accepted"
                                    ? "✓ Accepted"
                                    : notification.status === "rejected"
                                    ? "✕ Rejected"
                                    : "↻ In Review"}
                                </span>
                              )}
                              {notification.type === "new_job" && (
                                <span className="text-purple-600 font-bold">
                                  New Job Posted
                                </span>
                              )}
                              {!readNotifications.has(notification.id) && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(
                                notification.timestamp
                              ).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) =>
                              handleDeleteNotification(e, notification.id)
                            }
                            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateMainContent;
