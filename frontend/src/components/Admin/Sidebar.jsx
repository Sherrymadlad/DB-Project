import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Logo from "../../assets/Logo.png";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      name: "My Restaurants",
      icon: <HomeIcon className="h-5 w-5" />,
      path: "/admin/restaurants",
    },
    {
      name: "Add Restaurant",
      icon: <PlusCircleIcon className="h-5 w-5" />,
      path: "/admin/new/restaurant",
    },
    {
      name: "Profile",
      icon: <UserCircleIcon className="h-5 w-5" />,
      path: "/admin/profile",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between border-r border-theme-pink">
      {/* Logo */}
      <div>
        <div className="border-b p-2 border-theme-pink">
          <img
            src={Logo}
            alt="Logo"
            className="w-full mx-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-4 px-4">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`shadow flex items-center gap-3 px-3 py-2 rounded-md text-theme-brown text-xl hover:bg-theme-pink hover:text-white transition ${
                location.pathname.startsWith(tab.path)
                  ? "bg-theme-pink text-white"
                  : ""
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-theme-pink">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xl transition w-full"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
