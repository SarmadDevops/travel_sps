import React from 'react';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const Header = ({ setMobileOpen }) => {
  return (
    <header
      className="block md:flex lg:hidden sticky top-0 z-40 h-16 shadow-md items-center justify-between px-4 md:px-6 transition-all duration-300 border-b border-white/10 bg-gradient-to-r from-[#1a3a5c] to-[#1f7b85]"
    >

      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<MenuOutlined className="text-white text-xl md:text-2xl" />}
          onClick={() => setMobileOpen(true)}
          className="hover:bg-white/10 p-1 rounded-md"
        />

        <h2 className="text-white text-base md:text-lg font-semibold opacity-90">
          Super Admin Dashboard
        </h2>
      </div>

     
      <div className="hidden md:flex items-center gap-4">
      </div>
    </header>
  );
};

export default Header;
