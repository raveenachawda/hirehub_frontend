import React from 'react'
import { useSelector } from 'react-redux';

function Skills() {
  
  const user = useSelector((state) => state.auth.user || null);
  const skills = user?.profile?.skills ?? [];
  if (!user) return null;
  return (
    <div>
       <div className="mt-5">
          <h2 className="font-bold text-xl mb-2 ">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-white  text-black text-xxl font-medium px-3 py-1 rounded"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">NA</span>
            )}
          </div>
        </div>
    </div>
  )
}

export default Skills;

//skills delete karni ho tho yeh code use kar sakte ho
// import React, { useState } from 'react';

// function Skills() {
//   const [skills, setSkills] = useState(["Html", "Css", "Javascript", "Reactjs", "tailwind", "nodejs"]);

//   const handleDelete = (skillToDelete) => {
//     const updatedSkills = skills.filter(skill => skill !== skillToDelete);
//     setSkills(updatedSkills);
//   };

//   return (
//     <div className="mt-5">
//       <h2 className="font-semibold text-xl mb-2">Skills</h2>
//       <div className="flex flex-wrap gap-2">
//         {skills.length > 0 ? (
//           skills.map((skill, index) => (
//             <span
//               key={index}
//               onClick={() => handleDelete(skill)}
//               className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-red-200 transition"
//               title="Click to remove"
//             >
//               {skill}
//             </span>
//           ))
//         ) : (
//           <span className="text-sm text-gray-500">NA</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Skills;
