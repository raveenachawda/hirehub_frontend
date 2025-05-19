import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Application_API_END_POINT } from "@/utils/constant";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const res = await axios.post(
        `${Application_API_END_POINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setPreviewOpen(true);
  };

  if (!applicants || !applicants.applications) {
    return <div>No applications found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">{applicants.jobTitle}</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          application.applicant.profile?.profilePhoto ||
                          "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                        }
                        alt={application.applicant.fullname}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {application.applicant.fullname}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.applicant.profile?.bio ||
                          "No bio available"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{application.applicant.email}</p>
                    <p className="text-sm text-gray-500">
                      {application.applicant.phoneNumber || "No phone number"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) =>
                      handleStatusChange(application._id, value)
                    }
                    disabled={updatingStatus === application._id}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(application.applicant)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Profile Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Profile</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={
                      selectedApplicant.profile?.profilePhoto ||
                      "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                    }
                    alt={selectedApplicant.fullname}
                  />
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedApplicant.fullname}
                  </h3>
                  <p className="text-gray-600">{selectedApplicant.email}</p>
                  <p className="text-gray-600">
                    {selectedApplicant.phoneNumber || "No phone number"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-gray-600">
                  {selectedApplicant.profile?.bio || "No bio available"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.profile?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  )) || "No skills listed"}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Resume</h4>
                {selectedApplicant.profile?.resume ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedApplicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedApplicant.profile.resumeOriginalName}
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(selectedApplicant.profile.resume, "_blank")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600">No resume uploaded</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsTable;
