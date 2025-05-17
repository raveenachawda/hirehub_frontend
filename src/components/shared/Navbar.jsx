import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LayoutDashboard, LogOut, User2 } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
        timeout: 10000,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50">
        <div className="bg-white mb-4">
          <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
            <div>
              <h1 className="text-4xl font-bold">
                <NavLink to={"/"}>
                  Hire<span className="text-[#F83002]">hub</span>
                </NavLink>
              </h1>
            </div>
            <div className="flex gap-6">
              {user?.role !== "admin" && (
                <ul className="flex font-medium items-center gap-5">
                  {user && user.role === "recruiter" ? (
                    <>
                     
                    </>
                  ) : (
                    <>
                      <li className="font-bold">
                        <Link to="/">Home</Link>
                      </li>
                      <li className="font-bold">
                        <Link to="/aboutus">AboutUs</Link>
                      </li>
                      <li className="font-bold">
                        <Link to="/contactus">Contactus</Link>
                      </li>
                    </>
                  )}
                </ul>
              )}

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="bg-black text-white">
                      Login
                    </Button>
                  </Link>
                  <Link to="/Signup">
                    <Button className="bg-[#F83002] hover:bg-white text-black">
                      Signup
                    </Button>
                  </Link>
                </div>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="User"
                      />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex gap-2 mb-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="User"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>

                    <div className="my-2">
                      {user?.role === "student" && (
                        <>
                          <div className="mt-3 flex w-fit items-center gap-2 cursor-pointer">
                            <User2 />
                            <Button variant="link" className="font-bold">
                              <Link to="/profile">View Profile</Link>
                            </Button>
                          </div>

                          {location.pathname === "/" && (
                            <div className="mt-3 flex w-fit items-center gap-2 cursor-pointer">
                              <LayoutDashboard />
                              <Button variant="link" className="font-bold">
                                <Link to="/candidatedashboard">Dashboard</Link>
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      <div className="mt-3 flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button
                          onClick={logoutHandler}
                          variant="link"
                          className="font-bold"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
