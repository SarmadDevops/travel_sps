import React from "react";

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-2">
    <span className="text-[#13c2c2] text-xl bg-[#e6fffb] p-2 rounded-lg">
      {icon}
    </span>
    <h3 className="text-[#10314a] font-bold text-lg m-0">{title}</h3>
  </div>
);

export default SectionHeader;