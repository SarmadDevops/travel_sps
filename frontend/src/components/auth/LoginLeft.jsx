import React from "react";

import planeImage from "../../assets/aeroplan2.JPEG";

const LoginLeft = () => {
  return (
   
    <div className="hidden lg:block w-1/2 relative overflow-hidden">
 
      <div
        className="absolute inset-0 bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${planeImage})` }}
      >
        {/* Optional Overlay if needed later */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#10314A]/30 to-[#061A29]/70"></div> */}
      </div>

   
      <div className="relative z-10 h-full flex flex-col items-center justify-end text-black px-6 py-8 text-center">
        <h2 className="text-2xl font-black tracking-tight mb-3 uppercase drop-shadow-lg">
          Travel Insurance <br /> Portal
        </h2>
        
       
        <div className="w-16 h-1 bg-[#13C2C2] rounded-full mb-3"></div>

    
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-80">
          Release 1.0 Version
        </p>
      </div>
    </div>
  );
};

export default LoginLeft;