import React from "react";
import LoginLeft from "../../components/auth/LoginLeft";
import ChangePasswordRight from "../../components/auth/ChangePasswordRight";
// import Footer from "../../components/dashboard/shared/Footer";

const ChangePassword = () => {
  const backgroundStyle = {
    background: `linear-gradient(to bottom, #1A3A5C 0%, #1F7B85 100%)`,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content takes all available space above footer */}
      <div
        className="flex flex-1 items-center justify-center p-4 lg:p-10"
        style={backgroundStyle}
      >
        {/* Card - same as login page */}
        <div className="flex flex-col lg:flex-row w-full max-w-lg lg:max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* LEFT: Image/Marketing Section */}
          <LoginLeft />
          {/* RIGHT: Change Password Form Section */}
          <ChangePasswordRight />
        </div>
      </div>
      {/* Footer sticks at bottom */}
      {/* <Footer /> */}
    </div>
  );
};

export default ChangePassword;
