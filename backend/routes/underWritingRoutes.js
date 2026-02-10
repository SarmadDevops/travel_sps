const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const {
  createPolicy,
  getBranchPolicies,
  getAllPolicies,
  deletePolicy,
  getPoliciesByAgent,
  getAllUnpaidPolicies,
  getBranchUnpaidPolicies,
  getPolicyByPassportAndPolicyNumber,
  getBranchPolicyAnalytics,
  getAgentPolicyAnalytics,
  getAllPoliciesAnalytics,
  getPolicyById,
  updatePolicyStatusAndPayment,
  getPolicies,
  getMonthlyBusiness,
  getAllMonthlyBusiness,
  getAgentMonthlyBusiness,
  getAdminReport,
  getSuperAdminReport,
  updatePolicy
} = require("../controllers/underWritingController");

// ADMIN ROUTES
router.post("/", auth, authorize("ADMIN"), createPolicy);
router.get("/branch", auth, authorize("ADMIN"), getBranchPolicies);
router.get("/branch/analytics",auth,authorize("ADMIN"),getBranchPolicyAnalytics);
router.get( "/dashboard/monthly-business",auth,getMonthlyBusiness);

// SUPER ADMIN ROUTES
router.get("/", auth, authorize("SUPER_ADMIN"), getAllPolicies);
router.get("/all/analytics",auth,authorize("SUPER_ADMIN"), getAllPoliciesAnalytics);
router.get("/dashboard/monthly-business/all",auth,getAllMonthlyBusiness);


router.get("/unpaid", auth, authorize("SUPER_ADMIN"), getAllUnpaidPolicies);
router.get("/branch/unpaid", auth, authorize("ADMIN"), getBranchUnpaidPolicies);
// SUPER ADMIN → get policies by agent
router.get("/agent/:agentId", auth, authorize("SUPER_ADMIN","ADMIN","AGENT"), getPoliciesByAgent);
router.get( "/policy/search",getPolicyByPassportAndPolicyNumber);
router.get("/my-policies", auth, getPolicies);
router.get("/my-policies/analytics",auth,getAgentPolicyAnalytics);
router.get("/agent/dashboard/monthly-business",auth,getAgentMonthlyBusiness);
// Super Admin Report
// Only accessible by SUPER_ADMIN
// Example: /api/policy/reports/super-admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&branchName=BranchA
router.get("/super-admin", auth,authorize("SUPER_ADMIN"), getSuperAdminReport);

// Admin Report
// Only accessible by ADMIN
// Example: /api/policy/reports/admin?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
router.get("/admin", auth,authorize("ADMIN","AGENT"), getAdminReport);
router.put("/:policyId", auth, authorize("SUPER_ADMIN"), updatePolicy);
router.put("/:id/status", auth, authorize("SUPER_ADMIN"), updatePolicyStatusAndPayment);
router.get("/:id", auth, getPolicyById);

// router.put("/:id/status", auth, authorize("SUPER_ADMIN"), updatePolicyStatus);
// router.put("/:id/pay", auth, authorize("SUPER_ADMIN"), markPolicyPaid);

router.delete("/:id", auth, authorize("SUPER_ADMIN"), deletePolicy);

module.exports = router;
