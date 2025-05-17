
// import React from "react";
// import { Button } from "./ui/button";
// import { Bookmark } from "lucide-react";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { saveJob } from "@/redux/jobSlice";

// const Job = ({job, isInSavedPage = false }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const daysAgoFunction=(mongodbTime)=>{
//     const createdAt =new Date(mongodbTime);
//     const currentTime =new Date();
//     const timeDiffernce = currentTime -createdAt;
//     return Math.floor(timeDiffernce/(1000*24*60*60))
//   }
//   const handleSaveJob = (e) => {
//     e.stopPropagation();
//   console.log('Job being saved:', job); // Verify this output
//   dispatch(saveJob(job));
//   };
//   return (
//     <div className="bg-white shadow-lg rounded-md p-6  mx-auto border border-gray-200 ">
//       {/* Date Section */}
//       <div className="flex justify-between items-center text-gray-500 text-sm ">
//         <p>{daysAgoFunction(job?.createdAt)===0 ?"Today":`${daysAgoFunction(job?.createdAt)}`}days ago</p>
//         <Bookmark className="w-5 h-5 cursor-pointer" />
//       </div>

//       {/* Company Info */}
//       <div className="flex items-center gap-3 mt-4">
//         <Avatar className="w-12 h-12 rounded-full border border-gray-300">
//           <AvatarImage
//             src={job?.company?.logo}
//             alt="Company Logo"
//             className="w-full h-full object-cover"
//           />
//         </Avatar>
//         <div>
//           <h3 className="text-lg font-semibold">{job?.company?.name}</h3>
//           <p className="text-gray-500 text-sm mr-25">India</p>
//         </div>
//       </div>

//       {/* Job Title & Description */}
//       <div className="mt-4 text-center">
//         <h2 className="text-lg font-bold mr-80">{job?.title}</h2>
//         <p className="text-gray-600 text-sm  mt-2 text-justify">
//          {job?.description}
//         </p>
//       </div>
//       <div className="flex items-center gap-6 mt-4">
//         <badge className="text-orange-300 font-bold  " variant="ghost">
//           {" "}
//           {job?.position} Positions
//         </badge>
//         <badge className="text-gray-600 font-bold" variant="ghost">
//          {job?.jobType}
//         </badge>
//         <badge className="text-orange-900 font-bold " variant="ghost">
//           {job?.salary}LPA
//         </badge>
//       </div>
//       <div className="pt-8 flex justify-between">
//         <Button
//           onClick={() => navigate(`/description/${job?._id}`)}
//           variant="outline"
//         >
//           Details
//         </Button>
//         {/* <Button className="bg-[#F83002] font-bold "  onClick={handleSaveJob}> Save For Later</Button> */}
//         {!isInSavedPage && (
//           <Button className="bg-[#F83002] font-bold" onClick={handleSaveJob}>
//             Save For Later
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Job;
import React from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, removeSavedJob } from "@/redux/jobSlice";

const Job = ({ job, isInSavedPage = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  
  // Check if this job is already saved
  const isSaved = savedJobs.some(savedJob => savedJob._id === job._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDiffernce = currentTime - createdAt;
    return Math.floor(timeDiffernce / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = (e) => {
    e.stopPropagation();
    dispatch(saveJob(job));
  };

  const handleUnsaveJob = (e) => {
    e.stopPropagation();
    dispatch(removeSavedJob(job._id));
  };

  return (
    <div className="bg-white shadow-lg rounded-md p-6 mx-auto border border-gray-200">
      {/* Date Section */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <p>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
        {!isInSavedPage && (
          <Bookmark 
            className={`w-5 h-5 cursor-pointer ${isSaved ? 'fill-current text-blue-500' : ''}`}
            onClick={isSaved ? handleUnsaveJob : handleSaveJob}
          />
        )}
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mt-4">
        <Avatar className="w-12 h-12 rounded-full border border-gray-300">
          <AvatarImage
            src={job?.company?.logo}
            alt="Company Logo"
            className="w-full h-full object-cover"
          />
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{job?.company?.name}</h3>
          <p className="text-gray-500 text-sm mr-25">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mt-4 text-center">
        <h2 className="text-lg font-bold mr-80">{job?.title}</h2>
        <p className="text-gray-600 text-sm mt-2 text-justify">
          {job?.description}
        </p>
      </div>
      
      <div className="flex items-center gap-6 mt-4">
        <badge className="text-orange-300 font-bold" variant="ghost">
          {job?.position} Positions
        </badge>
        <badge className="text-gray-600 font-bold" variant="ghost">
          {job?.jobType}
        </badge>
        <badge className="text-orange-900 font-bold" variant="ghost">
          {job?.salary}LPA
        </badge>
      </div>
      
      <div className="pt-8 flex justify-between">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        
        {isInSavedPage ? (
          <Button 
            variant="destructive" 
            onClick={handleUnsaveJob}
            className="flex items-center gap-1"
          >
            <BookmarkCheck className="w-4 h-4" />
            Unsave
          </Button>
        ) : (
          !isSaved && (
            <Button className="bg-[#F83002] font-bold" onClick={handleSaveJob}>
              Save For Later
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default Job;