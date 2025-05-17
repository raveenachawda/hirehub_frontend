import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  // const {searchedQuery} = useSelector(store=>store.job);
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
        const res = await axios.get(`${JOB_API_END_POINT}/getall`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs || []));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        dispatch(setAllJobs([])); // Set empty array on error
        toast.error("Failed to fetch jobs");
      }
    };
    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
