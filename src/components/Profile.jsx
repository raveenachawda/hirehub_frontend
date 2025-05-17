// import React, { useState } from "react";
// import Navbar from "./shared/Navbar";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { Button } from "./ui/button";
// import { Badge, Contact, Mail, Pen } from "lucide-react";
// import { Label } from "@radix-ui/react-label";
// import AppliedJobTable from "./AppliedJobTable";
// import UpdateProfileDialog from "./UpdateProfileDialog";
// const skills = ["Html", "Css", "Javascript", "Reactjs"];
// const isResume = true;
// const Profile = () => {
//   const [open,setOpen]=useState(false);

//   return (
//     <div >
//       {/* <Navbar /> */}
//       <div className="max-w-6xl mx-auto bg-white border border-gray-300 rounded my-30 p-8">
//         <div className="flex justify-between ">
//           <div className="flex items-center gap-4  ">
//             <Avatar className="w-24 h-24">
//               <AvatarImage
//                 src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </Avatar>
//             <div>
//               <h1 className="font-medium text-xl mr-[800px]">Full Name</h1>
//               <p className="pr-5">
//                example:mern stack developer
//               </p>
//             </div>
//           </div>
//           <Button onClick={()=>setOpen(true)} className="text-right" variant="outline" size="icon" >
//             <Pen  className="w-4 h-4"/>
//           </Button>
//         </div>

//         <div className="my-5">
//           <div className="flex  items-center gap-3 my-2">
//             <Mail />
//             <span>raveenachawda0228@gmail.com</span>
//           </div>
//           <div className="flex items-center gap-3 my-2">
//             <Contact />
//             <span>9174991074</span>
//           </div>
//         </div>
//         <div className="my-5">
//           <h1 className="mr-[1200px] font-bold">Skills</h1>
//           <div className="flex items-center gap-1">
//             {skills.length !== 0 ? (
//               skills.map((item, index) => (
//                 <badge
//                   key={index}
//                   className="border border-black rounded-xl bg-black text-white h-7 w-20 mt-2 text-center"
//                 >
//                   {item}
//                 </badge>
//               ))
//             ) : (
//               <span>NA</span>
//             )}
//           </div>
//         </div>
//         <div className="grid w-full max-w-sm items-center gap-1.5 mr-[1200px] pr-60">
//           <Label className="text-md font-bold pr-22 ">Resume</Label>
//           {isResume ? (
//             <a
//               target="blank"
//               href="https://www.linkedin.com/feed/"
//               className="text-blue-500 w-full hover:underline cursor-pointer"
//             >
//               Raveena Mern stack
//             </a>
//           ) : (
//             <span>NA</span>
//           )}
//         </div>
//       </div>

//      < UpdateProfileDialog open={open} setOpen={setOpen}/>
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import Footer from "./shared/Footer";
import Skills from "./Skills";
import { useSelector } from "react-redux";

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  return (
    <>
      <div className="flex items-center justify-center  px-4 py-20 pt-15 pr-10 ">
        <div className="w-full max-w-xl h-[450px] bg-white border border-gray-200 rounded-xl shadow p-5">
          {/* Header */}
          <div className="flex justify-between items-start pt-5 ">
            <div className="flex items-center gap-4  ">
              <Avatar className="w-20 h-20 rounded-full overflow-hidden">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </Avatar>
              <div>
                <h1 className="font-bold text-xl ">{user?.fullname}</h1>
                <p className="text-gray-600 text-sm">{user?.profile?.bio}</p>
              </div>
            </div>
            <Button onClick={() => setOpen(true)} variant="outline" size="icon">
              <Pen className="w-4 h-4" />
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-2 text-gray-700 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Contact className="w-4 h-4" />
              <span>{user?.phoneNumber}</span>
            </div>
          </div>

          {/* Skills */}
          <Skills />

          {/* Resume */}
          <div className="mt-10">
            <h2 className="font-bold text-xl mb-1">Resume</h2>
            {isResume ? (
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                {user?.profile?.resumeOriginalName}
              </a>
            ) : (
              <span className="text-sm text-gray-500">NA</span>
            )}
          </div>
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Profile;
