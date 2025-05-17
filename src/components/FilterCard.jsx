// import { Label } from '@radix-ui/react-label'
// import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'

// import React from 'react'
// const filterData = [
//         {
//             fitlerType: "Location",
//             array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
//         },
//         {
//             fitlerType: "Industry",
//             array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
//         },
//         {
//             fitlerType: "Salary",
//             array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
//         },
//     ]

// const FilterCard = () => {
//   return (
//     <div>
//     <h1>Filter Jobs</h1> 
//     <hr className='mt-3'/>
//  <RadioGroup>
// {
//     filterData.map((data,index)=>(
//         <div key={index}>
//             <h1>{data.fitlerType}</h1>
//             {
//                 data.array.map((item,index)=>{
//                     return(
//                         <div key={index}>
//                             <RadioGroupItem value={item}/>
//                           <Label>{item}</Label>
//                         </div>
//                          )
//                 }
//             )
//             }
//         </div>
//     ) )
// }
//   </RadioGroup>
//     </div>
//   )
// }

// export default FilterCard

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Ensure correct import
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai","Indore","Bhopal"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer","Data Science","Python Developer","Andriod Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
 const [selectedValue ,setSelectedValue]=useState("");
 const dispatch = useDispatch();
 const changeHandler=(value)=>{
  setSelectedValue(value)
 }
useEffect(()=>{
  console.log(selectedValue);
  
dispatch(setSearchedQuery(selectedValue));
  
},[selectedValue]);
  return (
    <div className="w-full h-full bg-white  p-4 rounded-md ">
      <h1 className="mr-30 font-bold text-xl text-gray-500">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
      {
      filterData.map((data, index) => (
        <div key={index} >
          <h1 className="mr-30 mb-2 text-black font-bold" >{data.filterType}</h1>
            {
            data.array.map((item, idx) => {
              const itemId =`id${index}-${idx}`
                return(
                    <div className="flex items-center space-x-2 my-3">
                    <RadioGroupItem  value={item} id={itemId} className="border border-black space-y-4" />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                )})}
                
             </div>
            ))
            }

          </RadioGroup>
        
     
    </div>
  );
};

export default FilterCard;
