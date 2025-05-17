import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setAllJobs } from '@/redux/jobSlice';
import { Link } from 'react-router-dom';

const JobList = () => {
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allJobs.length === 0) {
      axios.get(`${JOB_API_END_POINT}/getall`, { withCredentials: true }).then((res) => {
        if (res.data.success) dispatch(setAllJobs(res.data.jobs));
      });
    }
  }, [dispatch, allJobs.length]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      <div className="grid grid-cols-2 gap-6">
        {allJobs.map((job) => (
          <Link key={job._id} to={`/job/${job._id}`}>
            <div className="border rounded-lg p-5 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-sm">{job.salary} LPA</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobList;
