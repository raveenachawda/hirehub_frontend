import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Initialize from location state
  useEffect(() => {
    if (location.state?.email && location.state?.role) {
      setEmail(location.state.email);
      setRole(location.state.role);
      handleSendOtp(); // Auto-send OTP when component mounts with email
    }
  }, [location]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault?.(); // Safe preventDefault
    
    // Validate inputs
    if (!email?.trim() || !role?.trim()) {
      toast.error("Please provide both email and role");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/send-otp`,
        { 
          email: email.trim(),
          role: role.trim() 
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("OTP sent successfully");
        setShowOtpForm(true);
        setResendDisabled(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Validate OTP format
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        { 
          email: email.trim(),
          otp: otp.trim() 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // toast.success("Email verified successfully!");
        
        // Clear session storage after successful verification
        sessionStorage.removeItem('otpData');
        
        // Redirect based on role
        const redirectPath = res.data.user.role === "recruiter" 
          ? "/admin/companies" 
          : "/";
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage = error.response?.data?.message || "Verification failed";
      toast.error(errorMessage.includes("expired") 
        ? "OTP has expired. Please request a new one." 
        : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendDisabled(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/resend-otp`,
        { 
          email: email.trim(),
          role: role.trim() 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "New OTP sent successfully");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg shadow-red-300 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Verify Your Email</h2>
        
        {!showOtpForm ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-red-300"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        ) : (
          <>
            <p className="text-center mb-6">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold">Enter OTP</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  className="p-2 border rounded-lg focus:ring focus:ring-red-300 text-center text-xl"
                  autoFocus
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled || isLoading}
                  className={`text-blue-600 text-sm ${
                    resendDisabled || isLoading 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:underline"
                  }`}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;