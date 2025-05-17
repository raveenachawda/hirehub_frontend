import { Badge } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
  const navigate = useNavigate();
  return (
    <div  onClick={()=>navigate(`/description/${job._id}`)}className='p-7 rounded-md shadow-xl bg-white border-gray-100 cursor-pointer text-left  '>
      <div  >
        <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
        <p className='text-sm text-gray-500'>India</p>
      </div>
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className='flex items-center gap-7 mt-4' >
 
 <badge className='text-orange-400 font-bold  ' variant="ghost"> {job?.position}Positions</badge>
 <badge className='text-gray-600 font-bold' variant="ghost">{job?.jobType}</badge>
 <badge className='text-orange-900 font-bold ' variant="ghost">{job?.salary}LPA</badge>
      </div>
    </div>
  )
}

export default LatestJobCards




