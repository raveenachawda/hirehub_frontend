import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../shared/Footer";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.res.data.message);
      toast.error(error.response.data.message);

      // if (
      //   error.response &&
      //   error.response.data &&
      //   error.response.data.message
      // ) {
      //   console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
      // } else {
      //   console.log(error.message);
      //   toast.error("Something went wrong!");
      // }
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      

      <div className="flex justify-center mt-8 p-4 ">
        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-red-300 p-6  ">
          <h2 className="text-4xl font-bold text-center mb-6">
            Sign <span className="text-[#F83002]">Up</span>
          </h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3 ">
                Full Name
              </label>
              <input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Enter name"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">Email</label>
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="Enter email"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">Phone No.</label>
              <input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="Enter number"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">Password</label>
              <input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <RadioGroup className="flex items-center gap-4 my-5">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="option-one"
                    className="text-gray-700 font-bold text-xl"
                  >
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer "
                  />
                  <Label
                    htmlFor="option-two"
                    className=" text-gray-700 font-bold  text-xl"
                  >
                    Recruiter
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2 ml-20 ">
                <Label className="ml-5 text-gray-700 font-bold text-xl">
                  Avatar
                </Label>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="cursor-pointer w-50 "
                />
              </div>
            </div>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Signup
              </Button>
            )}
            <span className="font-bold text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </form>
        </div>
      </div>
    
    </div>
  );
};
export default Signup;
