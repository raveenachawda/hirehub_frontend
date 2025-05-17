
import React from "react";
import { TableCell, TableRow } from "./ui/table";
import useGetAppliedJobs from "@/hooks/useGetAppliedJob";
import { useSelector } from "react-redux";
import { Badge } from "lucide-react";


const AppliedJobTable = () => {
useGetAppliedJobs();
const {allAppliedJobs}=useSelector(store=>store.job);


  return (
    <div className="p-4 mt-5  mr-100 w-[1250px] bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-[#dcdada] text-black font-semibold">
              <th className=" px-4 text-xl py-3">Date</th>
              <th className="px-4 py-3 text-xl">Job Role</th>
              <th className="px-4 py-3 text-xl">Company</th>
              <th className="px-4 py-3 text-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {
  allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id} className="border-b">
                <TableCell className="px-4 py-2">{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                <TableCell className="px-4 py-2">{appliedJob.job?.title}</TableCell>
                <TableCell className="px-4 py-2">{appliedJob.job?.company?.name}</TableCell>
                <TableCell className="text-right"><badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</badge></TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-sm mt-4 text-center">A list of your applied jobs</p>
    </div>
  );
};

export default AppliedJobTable;

