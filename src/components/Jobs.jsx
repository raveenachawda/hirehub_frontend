import React, { useEffect, useState } from "react";

import FilterCard from "./FilterCard";
import Job from "./Job";

import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];
const Jobs = () => {
  // const{allJobs}=useSelector(store=>store.job)
  const [allJobs, setAllJobs] = useState([]);
  const { searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        const query = searchedQuery.toLowerCase();

        // Convert salary safely to number
        const salary = Number(job.salary);

        if (query.includes("0-40k")) {
          return salary <= 40000;
        }

        if (query.includes("42-1lakh")) {
          return salary > 40000 && salary <= 100000;
        }

        if (query.includes("1lakh to 5lakh")) {
          return salary > 100000 && salary <= 500000;
        }

        return (
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getall`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAllJobs(res.data.jobs);
        }
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);
  return (
    <div>
      <div className="max-w-6xl w-[2900px] mx-auto mt-5 pt-1 mr-40 ">
        <div className="flex gap-5 ">
          <div className="w-20% ">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <div key={job?._id}>
                    <Job job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Jobs;
