import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2, Loader2, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const CompaniesTable = ({
  companies,
  onJoinCompany,
  showJoinButton,
  isLoading,
  onCompanyDeleted,
  onCompanyLeft,
}) => {
  const { searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const [joiningCompanyId, setJoiningCompanyId] = useState(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState(null);
  const [leavingCompanyId, setLeavingCompanyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  const handleJoinClick = async (companyId) => {
    setJoiningCompanyId(companyId);
    try {
      await onJoinCompany(companyId);
    } finally {
      setJoiningCompanyId(null);
    }
  };

  const handleLeaveCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to leave this company?")) {
      return;
    }

    setLeavingCompanyId(companyId);
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/leave/${companyId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Successfully left the company");
        if (onCompanyLeft) {
          onCompanyLeft(companyId);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave company");
    } finally {
      setLeavingCompanyId(null);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    setDeletingCompanyId(companyId);
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Company deleted successfully");
        if (onCompanyDeleted) {
          onCompanyDeleted(companyId);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete company");
    } finally {
      setDeletingCompanyId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f9e6e2]">
            <th className="px-4 py-2 text-left">Company Name</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Website</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterCompany.map((company) => (
            <tr key={company._id} className="border-b">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{company.name}</span>
                </div>
              </td>
              <td className="px-4 py-2">{company.location}</td>
              <td className="px-4 py-2">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website}
                </a>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  {showJoinButton ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#1e293b] hover:bg-[#ff5a3a]"
                      onClick={() => handleJoinClick(company._id)}
                      disabled={joiningCompanyId === company._id}
                    >
                      {joiningCompanyId === company._id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join Company"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleLeaveCompany(company._id)}
                      disabled={leavingCompanyId === company._id}
                    >
                      {leavingCompanyId === company._id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Leaving...
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          Leave
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filterCompany.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompaniesTable;
