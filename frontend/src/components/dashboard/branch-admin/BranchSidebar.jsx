import React, { useState, useEffect } from "react";
import { Drawer, Tooltip, Dropdown } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useLoading } from "../../../context/LoadingContext";
import {
  HomeOutlined,
  AppstoreOutlined,
  BankOutlined,
  LogoutOutlined,
  DownOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import spLogo from "../../../assets/splogo.png";
import spText from "../../../assets/securpathsolution.png";
const MENU_ITEMS = [
  {
    name: "Home",
    path: "/branch/dashboard",
    type: "link",
    icon: <HomeOutlined />,
  },
  {
    name: "Travel Packages",
    path: "/branch/packages",
    type: "dropdown",
    icon: <AppstoreOutlined />,
    children: [
      { name: "Schengen", path: "/branch/packages/schengen" },
      { name: "Rest of World", path: "/branch/packages/rest-of-world" },
      { name: "Worldwide", path: "/branch/packages/worldwide" },
      { name: "CoveragePlan", path: "/branch/packages/coverage-plan" },
      { name: "Domestic", path: "/branch/packages/domestic" },
      { name: "PakCare", path: "/branch/packages/pakcare" },
    ],
  },
  {
    name: "Branch Management",
    path: "/branch/my-branch", // Pointing to 'My Branch' or 'Create Branch'
    type: "link",
    icon: <BankOutlined />,
  },
  {
    name: "Agent Registration",
    path: "/branch/create-agent",
    type: "link",
    icon: <BankOutlined />,
  },
  {
    name: "Under Writer",
    path: "/branch/underwriting",
    type: "link",
    icon: <BankOutlined />,
  },
  {
    name: "Refresh Balance",
    path: "/branch/refresh-balance",
    type: "link",
    icon: <BankOutlined />,
  },
  {
    name: "Reports",
    path: "/branch/reports",
    type: "link",
    icon: <BankOutlined />,
  },
  {
    name: "Verify Policy",
    path: "/branch/verify-policy",
    type: "link",
    icon: <BankOutlined />,
  },
];

const BranchSidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const location = useLocation();
  const { setIsLoading } = useLoading();
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/branch/packages")) {
      setIsPackagesOpen(true);
    }
  }, [location.pathname]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); 
    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  const handleLinkClick = () => {
    setIsLoading(true);
    setMobileOpen(false);
  };

  const MenuList = () => (
    <div
      className={`flex-1 space-y-2 mt-6 overflow-y-auto scrollbar-custom ${
        collapsed ? "px-2" : "px-3"
      }`}
    >
      {MENU_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;

  
        if (item.type === "link") {
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group
                ${collapsed ? "justify-center px-0 h-12" : "px-4"}
                /* ACTIVE STATE: Prominent Cyan Gradient */
                ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20 hover:text-white"
                }
              `}
            >
              <Tooltip title={collapsed ? item.name : ""} placement="right">
                <span
                  className={`text-xl transition-colors flex items-center justify-center ${
                    isActive
                      ? "text-white"
                      : "text-cyan-400 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>
              </Tooltip>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        }

      
        if (item.type === "dropdown") {
          const isParentActive = location.pathname.includes(item.path);

       
          if (collapsed) {
            const dropdownMenu = {
              items: item.children.map((child) => ({
                key: child.path,
                label: <Link to={child.path}>{child.name}</Link>,
              })),
            };

            return (
              <Dropdown
                key={item.name}
                menu={dropdownMenu}
                placement="bottomRight"
                trigger={["hover"]}
                overlayStyle={{ width: 180 }}
              >
                <div
                  className={`
                    flex items-center justify-center h-12 rounded-xl cursor-pointer transition-all duration-300
                    /* ACTIVE STATE: Prominent Cyan */
                    ${
                      isParentActive
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50"
                        : "text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`text-xl flex items-center justify-center ${
                      isParentActive ? "text-white" : "text-cyan-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                </div>
              </Dropdown>
            );
          }

        
          return (
            <div key={item.name} className="flex flex-col">
              <div
                onClick={() => setIsPackagesOpen((prev) => !prev)}
                className={`
                  flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300
                  /* ACTIVE STATE: Prominent Cyan */
                  ${
                    isParentActive && !isPackagesOpen
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50"
                      : "text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xl ${
                      isParentActive ? "text-white" : "text-cyan-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isPackagesOpen ? (
                  <DownOutlined className="text-xs" />
                ) : (
                  <RightOutlined className="text-xs" />
                )}
              </div>

              {/* Submenu Items */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isPackagesOpen
                    ? "max-h-96 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center gap-3 pl-12 pr-4 py-2 my-1 rounded-lg text-sm transition-all
                        /* SUBMENU ACTIVE STATE: Prominent Cyan */
                        ${
                          isChildActive
                            ? "bg-gradient-to-r from-cyan-500/80 to-teal-500/80 text-white font-bold shadow-md shadow-cyan-500/30"
                            : "text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-teal-500/20"
                        }
                      `}
                    >
                      {/* Dot Color: White if active, Cyan if inactive */}
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isChildActive ? "bg-white" : "bg-cyan-400"
                        }`}
                      ></div>
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  return (
    <>
     
      <aside
        className={`hidden lg:flex flex-col h-screen fixed top-0 left-0 z-50 shadow-2xl transition-all duration-300 ease-in-out bg-gradient-to-b from-[#1a3a5c] to-[#1f7b85] ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
     
        <div
          className={`h-16 flex items-center relative border-b border-white/10 shadow-sm transition-all duration-300 ${
            collapsed ? "justify-center px-0" : "px-6"
          }`}
        >
          <img
            src={spLogo}
            alt="Logo"
            className="w-10 h-10 object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />

          {!collapsed && (
            <img
              src={spText}
              alt="Text"
              className="h-24 object-contain transition-all duration-300 ml-3"
              style={{
                filter: `brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.9))`,
              }}
            />
          )}

       
          <div
            onClick={() => setCollapsed(!collapsed)}
            className={`absolute cursor-pointer text-white/50 hover:text-white transition-colors flex items-center justify-center
               ${
                 collapsed ? "bottom-2 text-xs w-full" : "right-4 top-5 text-lg"
               }
             `}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

   
        <MenuList />

     
        <div
          className={`px-4 py-6 border-t border-white/10 ${
            collapsed ? "flex justify-center" : ""
          }`}
        >
          <Link
            to="/login"
            className={`flex items-center gap-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:text-white transition-all ${
              collapsed ? "justify-center px-0 w-10" : "px-4"
            }`}
          >
            <LogoutOutlined className="text-lg" />{" "}
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

    
      <Drawer
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={280}
        styles={{ body: { padding: 0 } }}
        className="lg:hidden"
        zIndex={60}
      >
        <div className="flex flex-col h-full text-white bg-gradient-to-b from-[#1a3a5c] to-[#1f7b85]">
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <img
              src={spLogo}
              alt="Logo"
              className="w-20 h-20 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <MenuList />
        </div>
      </Drawer>
    </>
  );
};

export default BranchSidebar;
