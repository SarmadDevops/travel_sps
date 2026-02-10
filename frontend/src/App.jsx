import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext";

// Auth Pages
import Login from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import BranchLayout from "./layouts/BranchLayout";

// Route Protection
import PrivateRoute from "./utils/PrivateRoute";

// Dashboard Pages
import Home from "./pages/dashboard/Home";
import CreateBranch from "./pages/dashboard/branch/CreateBranch";
import ViewBranchPage from "./pages/dashboard/branch/ViewBranchPage";
import AgentReg from "./pages/dashboard/AgentReg";
import ViewAgentPage from "./pages/dashboard/branch/ViewAgentPage";
import Underwriter from "./pages/dashboard/Underwriter";
import RefreshBalance from "./pages/dashboard/RefreshBalance";
import BranchHome from "./pages/dashboard/branch-admin/BranchHome";
import BranchProfile from "./pages/dashboard/branch-admin/BranchProfile";
import AgentHome from "./pages/dashboard/agent/AgentHome";
import AgentProfile from "./pages/dashboard/agent/AgentProfile";

// Travel Package Pages
import Schengen from "./pages/dashboard/packages/Schengen";
import RestOfWorld from "./pages/dashboard/packages/RestOfWorld";
import Worldwide from "./pages/dashboard/packages/Worldwide";
import Coverageplan from "./pages/dashboard/packages/CoveragePlan";
import Domestic from "./pages/dashboard/packages/Domestic";
import PakCare from "./pages/dashboard/packages/PakCare";
import VerifyPolicy from "./pages/dashboard/VerifyPolicy";
import Report from "./pages/dashboard/Reports";
import StudentPlanPage from "./pages/dashboard/packages/StudentPlanPage";

// ✅ IMPORT VIEW POLICY PAGE
import ViewPolicyPage from "./pages/dashboard/ViewPolicyPage";
import AgentPolicy from "./pages/dashboard/agent/AgentPolicy";

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (token && userRole) {
    if (userRole === "ADMIN") {
      return <Navigate to="/branch/dashboard" replace />;
    } else if (userRole === "SUPER_ADMIN") {
      return <Navigate to="/dashboard" replace />;
    } else if (userRole === "AGENT") {
      return <Navigate to="/agent/dashboard" replace />;
    }
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* --- Protected Dashboard Routes (Super Admin) --- */}
          <Route element={<PrivateRoute allowedRoles={["SUPER_ADMIN"]} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Home />} />

              {/* Branch routes */}
              <Route path="create-branch" element={<CreateBranch />} />
              <Route
                path="branch-details/:branchId"
                element={<ViewBranchPage />}
              />

              {/* Agent routes */}
              <Route path="agents/:agentId" element={<ViewAgentPage />} />
              <Route path="create-agent" element={<AgentReg />} />

              {/* Packages */}
              <Route
                path="packages/schengen"
                element={<Schengen userRole="SUPER_ADMIN" />}
              />
              <Route
                path="packages/rest-of-world"
                element={<RestOfWorld userRole="SUPER_ADMIN" />}
              />
              <Route
                path="packages/student-plan"
                element={<StudentPlanPage userRole="SUPER_ADMIN" />}
              />
              <Route
                path="packages/worldwide"
                element={<Worldwide userRole="SUPER_ADMIN" />}
              />
              <Route path="packages/coverage-plan" element={<Coverageplan />} />
              <Route
                path="packages/domestic"
                element={<Domestic userRole="SUPER_ADMIN" />}
              />
              <Route
                path="packages/pakcare"
                element={<PakCare userRole="SUPER_ADMIN" />}
              />

              {/* Other Dashboard */}
              <Route path="underwriting" element={<Underwriter />} />
              <Route path="refresh-balance" element={<RefreshBalance />} />

              {/* ✅ Super Admin Policy Routes */}
              <Route path="verify-policy" element={<VerifyPolicy />} />
              <Route path="policy-view/:id" element={<ViewPolicyPage />} />

              <Route path="reports" element={<Report />} />
            </Route>
          </Route>

          {/* --- Branch Admin Routes --- */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/branch" element={<BranchLayout />}>
              <Route path="dashboard" element={<BranchHome />} />
              <Route path="profile" element={<BranchProfile />} />
              <Route path="create-agent" element={<AgentReg />} />
              <Route path="agents/:agentId" element={<ViewAgentPage />} />
              <Route path="underwriting" element={<Underwriter />} />
              <Route path="verify-policy" element={<VerifyPolicy />} />
              <Route path="refresh-balance" element={<RefreshBalance />} />
              <Route path="reports" element={<Report />} />

              {/* ✅ ADDED: Branch Admin View Policy Route */}
              {/* Note: Ye route different hai super admin se (/branch/policy-view/...) */}
              <Route path="policy-view/:id" element={<ViewPolicyPage />} />

              {/* Branch Admin Package Routes - Read Only */}
              <Route
                path="packages/schengen"
                element={<Schengen userRole="ADMIN" />}
              />
              <Route
                path="packages/rest-of-world"
                element={<RestOfWorld userRole="ADMIN" />}
              />
              <Route
                path="packages/worldwide"
                element={<Worldwide userRole="ADMIN" />}
              />
              <Route path="packages/coverage-plan" element={<Coverageplan />} />
              <Route
                path="packages/student-plan"
                element={<StudentPlanPage userRole="ADMIN" />}
              />
            </Route>
          </Route>

          {/* --- Agent Routes --- */}
          <Route element={<PrivateRoute allowedRoles={["AGENT"]} />}>
            <Route path="/agent" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AgentHome />} />
              <Route path="profile" element={<AgentProfile />} />
              <Route path="underwriting" element={<Underwriter />} />
              <Route path="agent-policy" element={<AgentPolicy />} />
              <Route path="reports" element={<Report />} />
              <Route path="policy-view/:id" element={<ViewPolicyPage />} />

              {/* Agent Package Routes - Read Only */}
              <Route
                path="packages/schengen"
                element={<Schengen userRole="AGENT" />}
              />
              <Route
                path="packages/rest-of-world"
                element={<RestOfWorld userRole="AGENT" />}
              />
              <Route
                path="packages/worldwide"
                element={<Worldwide userRole="AGENT" />}
              />
              <Route path="packages/coverage-plan" element={<Coverageplan />} />
              <Route
                path="packages/student-plan"
                element={<StudentPlanPage userRole="AGENT" />}
              />
            </Route>
          </Route>

          {/* --- Authenticated Routes --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
