import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: email.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("OTP sent successfully");
        setShowOtpForm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/verify-reset-otp`,
        {
          email: email.trim(),
          otp: otp.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("OTP verified successfully");
        setShowResetForm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-15 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg shadow-red-300 p-6 mt-10 w-[500px]">
        <h2 className="text-4xl font-bold text-center mb-6">Reset Password</h2>

        {!showOtpForm && !showResetForm && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            {isLoading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Send OTP
              </Button>
            )}
          </form>
        )}

        {showOtpForm && !showResetForm && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            {isLoading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Verify OTP
              </Button>
            )}
          </form>
        )}

        {showResetForm && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-bold w-1/3">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-2/3 p-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
            {isLoading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Reset Password
              </Button>
            )}
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
