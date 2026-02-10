import React from "react";
import { BankOutlined } from "@ant-design/icons";

const ProfileHeader = ({ branchData }) => {
  return (
    <div className="bg-gradient-to-r from-[#10314a] to-[#13c2c2] rounded-2xl p-6 md:p-8 shadow-xl mb-6 animate-fade-in">
   
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        
      
        <div className="p-4 md:p-5 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg shrink-0">
          <BankOutlined className="text-4xl md:text-5xl text-white" />
        </div>

      
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {branchData?.branchName || "Branch Profile"}
          </h1>
          
          <p className="text-white/90 text-base md:text-lg mb-1">
            Branch Code:{" "}
      
            <span className="font-semibold bg-white/10 px-2 py-0.5 rounded border border-white/20">
              {branchData?.branchCode || "N/A"}
            </span>
          </p>
          
          <p className="text-white/80 text-xs md:text-sm">
            Manage and view your branch information
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;