// // components/SavedJobs.jsx
// import React from "react";
// import { useSelector } from "react-redux";
// import Job from "./Job";

// const SavedJobs = () => {
//   const { savedJobs } = useSelector((store) => store.job);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Your Saved Jobs</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {savedJobs?.length > 0 ? (
//           savedJobs.map((job) => <Job key={job._id} job={job} />)
//         ) : (
//           <p className="text-gray-500">You haven't saved any jobs yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SavedJobs;
//2
// 
import React from "react";
import { useSelector } from "react-redux";
import Job from "./Job";

const SavedJobs = () => {
  const { savedJobs } = useSelector((store) => store.job);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Saved Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs?.length > 0 ? (
          savedJobs.map((job) => (
            <div key={job._id}>
              <Job job={job} isInSavedPage={true} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">You haven't saved any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;