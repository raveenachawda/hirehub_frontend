import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { Application_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ApplicantsTable from "./ApplicantsTable ";
import { setAllApplicants } from "@/redux/application.Slice";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${Application_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllApplicants(res.data));
        } else {
          toast.error("Failed to fetch applicants");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch applicants"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">
            Applicants
            {applicants?.applications && (
              <span className="text-gray-500 ml-2">
                ({applicants.applications.length})
              </span>
            )}
          </h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ApplicantsTable />
        )}
      </div>
    </div>
  );
};

export default Applicants;
