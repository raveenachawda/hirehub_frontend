import React, { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import {
  UserIcon,
  SearchIcon,
  FileTextIcon,
  BriefcaseIcon,
} from "lucide-react"; // or use react-icons if you prefer

const steps = [
  {
    title: "Create an Account",
    description:
      "Sign up with just a few clicks to unlock exclusive access to a world of job opportunities and landing your dream job. It's quick, easy, and completely free.",
    icon: <UserIcon className="w-6 h-6" />,
    textColor: "text-[#fa4e09]",
    bgColor: "bg-[#fff9f6]",
  },
  {
    title: "Search Job",
    description:
      "Dive into our job database tailored to match your skills and preferences. With our advanced search filters, finding the perfect job has never been easier.",
    icon: <SearchIcon className="w-6 h-6" />,
    textColor: "text-[#6a38c2]",
    bgColor: "bg-[#e9ddff]",
  },
  {
    title: "Upload CV/Resume",
    description:
      "Showcase your experience by uploading your CV or resume. Let employers know why you're the perfect candidate for their job openings.",
    icon: <FileTextIcon className="w-6 h-6" />,
    textColor: "text-[#3ac2ba]",
    bgColor: "bg-[#f0fffe]",
  },
  {
    title: "Get Job",
    description:
      "Take the final step towards your new career. Get ready to embark on your professional journey and secure the job you've been dreaming of.",
    icon: <BriefcaseIcon className="w-6 h-6" />,
    textColor: "text-[#fbbc09]",
    bgColor: "bg-[#fff8e3]",
  },
];

const StepsSection = () => {
  useEffect(() => {
    ScrollReveal().reveal(".step-card", {
      origin: "bottom",
      distance: "50px",
      duration: 800,
      easing: "ease-in-out",
      interval: 200,
    });
  }, []);

  return (
    <>
      <h1 className="text-5xl font-bold pt-18 text-center">ABOUT US</h1>
      <section
        id="about"
        className=" bg-center bg-no-repeat py-15 px-4 sm:px-8 lg:px-16 w-full h-[490px]"
      >
        <div className="max-w-6xl mx-auto  text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Get Hired in 4{" "}
            <span className="text-[#F83002]">Quick Easy Steps</span>
          </h2>
          <p className="text-gray-600 mb-10">
            Follow Our Simple, Step-by-Step Guide to Quickly Land Your Dream Job
            and Start Your New Career Journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step-card bg-white rounded-md shadow-lg p-6 text-left"
              >
                <span
                  className={`inline-flex items-center justify-center mb-4 p-3 rounded-full ${step.bgColor} ${step.textColor}`}
                >
                  {step.icon}
                </span>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StepsSection;
