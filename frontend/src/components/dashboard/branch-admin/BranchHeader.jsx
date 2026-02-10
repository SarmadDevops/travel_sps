import React from 'react';
import { Button, Dropdown } from 'antd';
import { 
  MenuOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  DownOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const BranchHeader = ({ setMobileOpen }) => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === '1') navigate('/change-password');
    else if (key === '2') {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const items = [
    { key: '1', label: 'Change Password', icon: <UserOutlined /> },
    { key: '2', label: 'Logout', icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <header 
   
      className="sticky top-0 z-40 h-16 shadow-md flex items-center justify-between px-6 transition-all duration-300 border-b border-white/10 bg-gradient-to-r from-[#1a3a5c] to-[#1f7b85]"
    >
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button 
          type="text" 
          icon={<MenuOutlined className="text-white text-lg" />} 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden hover:bg-white/10" 
        />
        
        <h2 className="text-white text-lg font-semibold hidden md:block opacity-90">
          Branch Portal
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 py-1 px-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
            <div className="hidden md:flex flex-col items-start">
              {/* 👇 Updated Name for Branch Admin */}
              <span className="text-white text-sm font-semibold leading-tight">Branch Manager</span>
              <span className="text-cyan-300 text-xs font-medium">Restricted Access</span>
            </div>
            <DownOutlined className="text-gray-300 text-xs hidden md:block" />
          </div>
        </Dropdown>
      </div>

    </header>
  );
};

export default BranchHeader;