import { Badge } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Application_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { User } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [recruiterDetails, setRecruiterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  const jobId = params.id;

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${Application_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchsingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          console.log("Job data:", res.data.job);
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );

          // Set recruiter details from populated data
          if (res.data.job.created_by) {
            setRecruiterDetails(res.data.job.created_by);
          } else {
            console.log("No recruiter information in job data");
            toast.error("No recruiter information available");
          }
        }
      } catch (error) {
        console.error(
          "Error fetching job details:",
          error.response?.data || error
        );
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchsingleJob();
  }, [jobId, dispatch, user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]">
      <div className="flex items-center justify-between pr-60">
        <div>
          <h1 className="font-bold text-2xl ml-[200px] pt-10">
            {singleJob?.title}
          </h1>
          <div className="flex items-center gap-7 mt-4 ml-52">
            <badge
              className="text-orange-400 font-bold border border-gray-300"
              variant="ghost"
            >
              {singleJob?.position} Positions
            </badge>
            <badge
              className="text-gray-600 font-bold border border-gray-300"
              variant="ghost"
            >
              {singleJob?.jobType}
            </badge>
            <badge
              className="text-orange-900 font-bold border border-gray-300"
              variant="ghost"
            >
              {singleJob?.salary}LPA
            </badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#F83002] hover:bg-black hover:text-white text-black font-bold"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="font-bold py-6 pl-50 text-2xl">Job Description</h1>
      <hr className="my-1 border-t border-gray-400 w-[1140px] mx-auto" />
      <div className="my-4 px-50">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="font-bold my-1">
              Role:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.title}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Location:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.location}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Description:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.description}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Experience:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.experience} yrs
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Salary:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.salary}LPA
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Total Applicants:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.applications?.length}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Posted Date:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.createdAt?.split("T")[0]}
              </span>
            </h1>
          </div>

          {/* Recruiter Details Section */}
          {recruiterDetails ? (
            <div className="w-80 bg-white rounded-lg shadow-md p-6 ml-8">
              <h2 className="font-bold text-lg mb-4">Recruiter Details</h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#ffe5e0] flex items-center justify-center">
                  <User className="h-6 w-6 text-[#ff6b6b]" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    {recruiterDetails.fullname}
                  </h2>
                  <p className="text-gray-600">{recruiterDetails.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Posted this job</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-80 bg-white rounded-lg shadow-md p-6 ml-8">
              <p className="text-gray-600">Recruiter details not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
