// import React, { useEffect, useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Input } from '../ui/input'
// import { Button } from '../ui/button' 

// import { useDispatch } from 'react-redux' 
// import { setSearchCompanyByText } from '@/redux/companySlice'
// import AdminJobsTable from './AdminJobsTable'
// import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'

// const AdminJobs = () => {
// useGetAllAdminJobs();
//   const [input, setInput] = useState("");
 
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(setSearchCompanyByText(input));
//   }, [input]);
//   return (
//     <div>
//       <Navbar />
//       <div className='p-4 mx-auto my-10 min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]'>
//         <div className='flex items-center justify-between my-5'>
//           <Input
//             className="w-fit"
//             placeholder="Filter by name, role"
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <Button >New Jobs</Button>
//         </div>
//       <AdminJobsTable/>
//       </div>
//     </div>
//   )
// }

// export default AdminJobs
import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button'; 
import { useDispatch } from 'react-redux'; 

import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]">
      <Navbar />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between my-8 gap-4">
          <Input
            className="w-full md:w-1/3 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-400"
            placeholder="Filter by company, role"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-2">
            New Jobs
          </Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;
