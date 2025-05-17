import React from 'react'

import Job from './Job';
import { useSelector } from 'react-redux';
// const randomJobs=[1,2,3,4,5,5];

const Browse = () => {
  const{allJobs}=useSelector(store=>store.job);
  return (
    <div >
  
   <div className='max-w-7xl w-[2900px] mx-auto my-1'>
    <h1 className='mr-[800px] font-bold text-2xl my-2'>
        Search Result ({allJobs.length})</h1>
        <div className='grid grid-cols-3 gap-4 m-5'>
      
        {/* {
            randomJobs.map((item)=>{
                return(
                    <Job key={item}/>
                )
            })
        } */}
         { allJobs.length <= 0 ? <span>No Job Available</span> : allJobs?.slice(0, 6).map((job) => (
          <Job key={job._id} job={job} />
        ))}
        </div>
       
   </div>
    </div>
  )
}

export default Browse
