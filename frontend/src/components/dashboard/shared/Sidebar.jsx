import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLoading } from "../../../context/LoadingContext";
import {
  LogoutOutlined,
  DownOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  DashboardOutlined,
  GlobalOutlined,
  ApartmentOutlined,
  TeamOutlined,
  AuditOutlined,
  SyncOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  LockOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";

import spLogo from "../../../assets/splogo.png";
import spText from "../../../assets/securpathsolution.png";

const SUPER_ADMIN_MENU = [
  {
    name: "Home",
    path: "/dashboard",
    type: "link",
    icon: <DashboardOutlined />,
  },
  {
    name: "Travel Packages",
    path: "/dashboard/packages",
    type: "dropdown",
    icon: <GlobalOutlined />,
    children: [
      { name: "Schengen", path: "/dashboard/packages/schengen" },
      { name: "Rest of World", path: "/dashboard/packages/rest-of-world" },
      { name: "Worldwide", path: "/dashboard/packages/worldwide" },
      { name: "Coverage Plan", path: "/dashboard/packages/coverage-plan" },
      { name: "Student Plan", path: "/dashboard/packages/student-plan" },
    ],
  },
  {
    name: "Branch Registration",
    path: "/dashboard/create-branch",
    type: "link",
    icon: <ApartmentOutlined />,
  },
  {
    name: "Verify Policy",
    path: "/dashboard/verify-policy",
    type: "link",
    icon: <CheckCircleOutlined />,
  },
  {
    name: "Reports & Analytics",
    path: "/dashboard/reports",
    type: "link",
    icon: <BarChartOutlined />,
  },
  {
    name: "Change Password",
    path: "/change-password",
    type: "link",
    icon: <LockOutlined />,
  },
];

const BRANCH_ADMIN_MENU = [
  {
    name: "Home",
    path: "/branch/dashboard",
    type: "link",
    icon: <DashboardOutlined />,
  },
  {
    name: "Profile",
    path: "/branch/profile",
    type: "link",
    icon: <UserOutlined />,
  },
  {
    name: "Travel Packages",
    path: "/branch/packages",
    type: "dropdown",
    icon: <GlobalOutlined />,
    children: [
      { name: "Schengen", path: "/branch/packages/schengen" },
      { name: "Rest of World", path: "/branch/packages/rest-of-world" },
      { name: "Worldwide", path: "/branch/packages/worldwide" },
      { name: "Coverage Plan", path: "/branch/packages/coverage-plan" },
      { name: "Student Plan", path: "/branch/packages/student-plan" },
    ],
  },
  {
    name: "Agent Registration",
    path: "/branch/create-agent",
    type: "link",
    icon: <TeamOutlined />,
  },
  {
    name: "Underwriting",
    path: "/branch/underwriting",
    type: "link",
    icon: <AuditOutlined />,
  },
  {
    name: "Refresh Balance",
    path: "/branch/refresh-balance",
    type: "link",
    icon: <SyncOutlined />,
  },
  {
    name: "Verify Policy",
    path: "/branch/verify-policy",
    type: "link",
    icon: <CheckCircleOutlined />,
  },
  {
    name: "Reports & Analytics",
    path: "/branch/reports",
    type: "link",
    icon: <BarChartOutlined />,
  },
  {
    name: "Change Password",
    path: "/change-password",
    type: "link",
    icon: <LockOutlined />,
  },
];

const AGENT_MENU = [
  {
    name: "Home",
    path: "/agent/dashboard",
    type: "link",
    icon: <DashboardOutlined />,
  },
  {
    name: "Profile",
    path: "/agent/profile",
    type: "link",
    icon: <UserOutlined />,
  },
  {
    name: "Agent Policies",
    path: "/agent/agent-policy",
    type: "link",
    icon: <CheckCircleOutlined />,
  },
  {
    name: "Reports & Analytics",
    path: "/agent/reports",
    type: "link",
    icon: <BarChartOutlined />,
  },
  {
    name: "Change Password",
    path: "/change-password",
    type: "link",
    icon: <LockOutlined />,
  },
];

const Sidebar = ({ collapsed, setCollapsed, userRole = "SUPER_ADMIN" }) => {
  const location = useLocation();
  const { setIsLoading } = useLoading();
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItemRef = useRef(null);

  const MENU_ITEMS =
    userRole === "ADMIN"
      ? BRANCH_ADMIN_MENU
      : userRole === "AGENT"
        ? AGENT_MENU
        : SUPER_ADMIN_MENU;

  useEffect(() => {
    if (
      location.pathname.includes("/dashboard/packages") ||
      location.pathname.includes("/branch/packages") ||
      location.pathname.includes("/agent/packages")
    ) {
      setIsPackagesOpen(true);
    }
    const timer = setTimeout(() => {
      if (activeItemRef.current) {
        activeItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  const handleLinkClick = (path) => {
    setMobileOpen(false);

    if (location.pathname === path) {
      return;
    }

    setIsLoading(true);
    if (collapsed) {
      setCollapsed(false);
    }
  };

  const MenuList = () => (
    <div className="flex flex-col gap-2 w-full">
      {MENU_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        if (item.type === "link") {
          return (
            <Link
              key={item.path}
              to={item.path}
              ref={isActive ? activeItemRef : null}
              onClick={() => handleLinkClick(item.path)}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 w-full
                ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20 hover:text-white"
                }`}
            >
              <span
                className={`text-xl ${
                  isActive ? "text-white" : "text-cyan-400"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        }
        if (item.type === "dropdown") {
          const isParentActive = location.pathname.includes(item.path);
          return (
            <div key={item.name} className="w-full">
              <div
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false);
                  }
                  setIsPackagesOpen(!isPackagesOpen);
                }}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all w-full
                  ${
                    isParentActive
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50"
                      : "text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl text-cyan-400">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </div>
                {!collapsed &&
                  (isPackagesOpen ? (
                    <DownOutlined className="text-xs" />
                  ) : (
                    <RightOutlined className="text-xs" />
                  ))}
              </div>
              {!collapsed && (
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isPackagesOpen ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  {item.children.map((child) => {
                    const isChildActive = location.pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        ref={isChildActive ? activeItemRef : null}
                        onClick={() => handleLinkClick(child.path)}
                        className={`flex items-center gap-3 pl-12 pr-4 py-2 my-1 rounded-lg text-sm transition-all w-full
                          ${
                            isChildActive
                              ? "bg-gradient-to-r from-cyan-500/80 to-teal-500/80 text-white font-bold shadow-md shadow-cyan-500/30"
                              : "text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isChildActive ? "bg-white" : "bg-cyan-400"
                          }`}
                        />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-b from-[#1a3a5c] to-[#1f7b85] text-white shadow-md fixed top-0 left-0 w-full z-[999]">
        <div className="flex items-center gap-2">
          <img
            src={spLogo}
            className="h-10 w-10 object-contain brightness-0 invert"
            alt="Logo"
          />
          <img
            src={spText}
            className="h-20 object-contain brightness-0 invert"
            alt="SP Solution"
          />
        </div>
        <div onClick={() => setMobileOpen(true)} className="p-2 cursor-pointer">
          <MenuOutlined className="text-2xl text-white" />
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-[2000] bg-gradient-to-b from-[#1a3a5c] to-[#1f7b85] text-white transition-transform duration-500 ease-in-out transform flex flex-col
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={spLogo}
              className="h-22 w-14 object-contain brightness-0 invert"
              alt="Logo"
            />
            <img
              src={spText}
              className="h-32 object-contain brightness-0 invert"
              alt="SP Solution"
            />
          </div>
          <div
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-all active:scale-90"
          >
            <CloseOutlined className="text-2xl text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 w-full">
          <MenuList />
          <div className="mt-8 border-t border-white/10 pt-4 pb-10">
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");
                setMobileOpen(false);
              }}
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-white font-bold transition-all w-full"
            >
              <LogoutOutlined className="text-xl" />
              <span className="text-base">Logout</span>
            </Link>

            <div className="mt-6 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50">
                Release 1.0 Version
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-50 shadow-2xl transition-all duration-300
        bg-gradient-to-b from-[#1a3a5c] to-[#1f7b85]
        ${collapsed ? "w-20" : "w-72"}`}
      >
        {/* LOGO */}
        <div
          className={`flex items-center border-b border-white/10 transition-all duration-300
          ${collapsed ? "h-16 justify-center" : "h-28 px-6"}`}
        >
          <img
            src={spLogo}
            className={`transition-all duration-300 object-contain ${
              collapsed ? "h-32 w-8" : "h-16 w-16"
            }`}
            style={{ filter: "brightness(0) invert(1)" }}
            alt="Logo"
          />
          {!collapsed && (
            <img
              src={spText}
              className="h-32 ml-4 object-contain transition-all duration-300"
              style={{
                filter:
                  "brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.4))",
              }}
              alt="SP Solution"
            />
          )}
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto scrollbar-custom px-2 py-4">
          <MenuList />
        </div>

        {!collapsed && (
          <div className="px-6 py-2 text-center select-none">
            <p className="text-[10px] font-bold text-cyan-200/50 uppercase tracking-widest">
              Release 1.0 Version
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div
          className={`px-4 py-4 border-t border-white/10 transition-all duration-300
          ${
            collapsed
              ? "flex flex-col items-center gap-4"
              : "flex items-center justify-between"
          }`}
        >
          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userRole");
            }}
            className={`flex items-center gap-4 py-3 rounded-xl text-sm font-semibold
            text-red-300 hover:bg-red-500/20 hover:text-white transition-all
            ${collapsed ? "justify-center w-10" : "px-4"}`}
          >
            <LogoutOutlined className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </Link>

          <div
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center rounded-xl cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 transition-all w-10 h-10"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-lg" />
            ) : (
              <MenuFoldOutlined className="text-lg" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
