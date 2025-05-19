import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        // Check if user is blocked
        if (res.data.user.status === "blocked") {
          toast.error(
            "Your account has been blocked. Please contact the administrator."
          );
          return;
        }

        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // Check if user is verified
        if (!res.data.user.isVerified) {
          navigate("/verify-email", {
            state: {
              email: input.email,
              role: res.data.user.role,
            },
          });
          return;
        }

        // Redirect based on role
        switch (res.data.user.role) {
          case "admin":
            navigate("/dashboard");
            break;
          case "recruiter":
            navigate("/admin/companies");
            break;
          case "student":
            navigate("/candidatedashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        navigate("/verify-email", {
          state: {
            email: error.response.data.email,
            role: error.response.data.role,
          },
        });
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="flex justify-center mt-15 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-red-300 p-6 mt-10 w-[500px]">
          <h2 className="text-4xl font-bold text-center mb-6">Login</h2>
          <form className="space-y-4" onSubmit={submitHandler}>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
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
                  <Label htmlFor="option-one" className="font-semibold text-xl">
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
                  <Label htmlFor="option-two" className="font-semibold text-xl">
                    Recruiter
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={input.role === "admin"}
                    onChange={changeEventHandler}
                    className="cursor-pointer "
                  />
                  <Label htmlFor="option-two" className="font-semibold text-xl">
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Login
              </Button>
            )}

            <div className="flex justify-between">
              <span className="font-bold text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600">
                  Signup
                </Link>
              </span>
              <Link to="/forgot-password" className="text-blue-600 text-xxl">
                Forgot Password?{" "}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
