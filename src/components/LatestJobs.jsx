import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  return (
    <div className="max-w-7xl mx-auto my-20 ml-20 mr-30 w-[1109px] h-96">
      <h1 className="text-4xl font-bold mr-[600px]">
        <span className="text-[#F83002]">Latest & Top </span>Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-14">
        {/*// multiple job cards display*/}
        {allJobs.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500 text-lg">
              No jobs available at the moment
            </p>
          </div>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
