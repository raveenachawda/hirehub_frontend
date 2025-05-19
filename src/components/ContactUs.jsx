import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import { CONTACT_API_END_POINT } from "@/utils/constant";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // First test the server connection
      try {
        await api.get("/test");
      } catch (error) {
        toast.error("Cannot connect to server. Please try again later.");
        setLoading(false);
        return;
      }

      // If server is up, send the contact form
      const response = await api.post("/api/v1/contact/submit", formData);

      if (response.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        // Server responded with error
        toast.error(error.response.data.message || "Error sending message");
      } else if (error.request) {
        // No response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Request setup error
        toast.error("Error setting up the request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center px-4 py-12 pt-3"
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left Side */}
          <div className="bg-black text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">
              Get <span className="text-[#F83002]">in</span> Touch
            </h2>
            <p className="text-base text-gray-200">
              We'd love to hear from you! Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          {/* Right Side */}
          <div className="p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-xl font-bold text-black">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full border-2 border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#F83002]"
                />
              </div>
              <div>
                <label className="block mb-1 text-xl font-bold text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full border-2 border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#F83002]"
                />
              </div>
              <div>
                <label className="block mb-1 text-xl font-bold text-black">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your message..."
                  required
                  className="w-full border-2 border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#F83002]"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white py-3 rounded-md hover:bg-[#F83002] transition-colors duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
}
