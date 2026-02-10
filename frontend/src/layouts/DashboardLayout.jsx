import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";
import Sidebar from "../components/dashboard/shared/Sidebar";
import Header from "../components/dashboard/shared/Header";
import { useLoading } from "../context/LoadingContext";
import AnalyticsCards from "../components/dashboard/home/AnalyticsAdminCards";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoading } = useLoading();
  const location = useLocation();
  const mainRef = React.useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const userRole = localStorage.getItem("userRole") || "SUPER_ADMIN";

  return (
    <div className="h-screen pt-20 lg:pt-0 bg-gray-50 flex w-full overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userRole={userRole}
      />

      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* <Header setMobileOpen={setMobileOpen} /> */}

        <main
          ref={mainRef}
          className="flex-1 p-4 sm:p-6 w-full overflow-y-auto overflow-x-hidden"
          style={{ scrollBehavior: "smooth" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Spin size="large" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
