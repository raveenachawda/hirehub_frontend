import React, { useState } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Eye } from "lucide-react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import Footer from "./shared/Footer";
import Skills from "./Skills";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <div className="flex items-center justify-center px-4 py-20 pt-15 pr-10">
        <div className="w-full max-w-xl h-[450px] bg-white border border-gray-200 rounded-xl shadow p-5">
          {/* Header */}
          <div className="flex justify-between items-start pt-5">
            <div className="flex items-center gap-4">
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
                <h1 className="font-bold text-xl">{user?.fullname}</h1>
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
              <div className="flex items-center gap-4">
                <a
                  href={user?.profile?.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {user?.profile?.resumeOriginalName}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">NA</span>
            )}
          </div>
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />

        {/* Resume Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`${user?.profile?.resume}#toolbar=0`}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Profile;
