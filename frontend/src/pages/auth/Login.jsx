import React from "react";
import LoginLeft from "../../components/auth/LoginLeft";
import LoginRight from "../../components/auth/LoginRight";
// import Footer from "../../components/dashboard/shared/Footer";
const Login = () => {
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
        {/* Login card - compact size */}
        <div className="flex flex-col lg:flex-row w-full max-w-lg lg:max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* LEFT: Image/Marketing Section */}
          <LoginLeft />
          {/* RIGHT: Login Form Section */}
          <LoginRight />
        </div>
      </div>
      {/* Footer sticks at bottom */}
      {/* <Footer /> */}
    </div>
  );
};
export default Login;
