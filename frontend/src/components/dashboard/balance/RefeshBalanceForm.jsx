// import React, { useState, useEffect } from 'react';
// import { Button, ConfigProvider, message, Tooltip, Skeleton } from 'antd';
// import { 
//   WalletOutlined, 
//   BankOutlined, 
//   FileDoneOutlined, 
//   ReloadOutlined,
//   DollarCircleOutlined,
//   InfoCircleOutlined
// } from '@ant-design/icons';

// const RefreshBalanceForm = () => {
//   const [loading, setLoading] = useState(false);
  
//   // 1. STATE TO HOLD API DATA
//   const [balanceData, setBalanceData] = useState({
//     creditLimit: 0,
//     transferBalance: 0,
//     issuedPolicies: 0,
//     remainingBalance: 0
//   });

//   // 2. SIMULATE GET API CALL
//   const fetchBalanceData = () => {
//     setLoading(true);
//     // Simulate API delay
//     setTimeout(() => {
//       setBalanceData({
//         creditLimit: 300000,
//         transferBalance: 0,
//         issuedPolicies: 11500,
//         remainingBalance: 288500
//       });
//       setLoading(false);
//       message.success('Data synced with server');
//     }, 800);
//   };

//   // Fetch on mount
//   useEffect(() => {
//     fetchBalanceData();
//   }, []);

//   // Custom Stat Card (Display Only - No Inputs)
//   const StatCard = ({ label, value, icon, color, bgColor, helpText }) => (
//     <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center gap-3">
//           <div className={`p-3 rounded-xl text-xl ${bgColor} ${color}`}>
//             {icon}
//           </div>
//           <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">{label}</span>
//         </div>
//         {helpText && (
//           <Tooltip title={helpText}>
//             <InfoCircleOutlined className="text-gray-300 hover:text-[#13c2c2] cursor-pointer" />
//           </Tooltip>
//         )}
//       </div>

//       {/* DATA DISPLAY */}
//       <div>
//         {loading ? (
//           <Skeleton.Button active size="large" style={{ width: 120 }} />
//         ) : (
//           <h3 className={`font-extrabold text-3xl ${color} m-0 tracking-tight`}>
//             {value.toLocaleString()}
//           </h3>
//         )}
//       </div>
      
//       {/* Decorative BG */}
//       <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${bgColor} opacity-20 group-hover:scale-110 transition-transform`}></div>
//     </div>
//   );

//   return (
//     <ConfigProvider
//       theme={{
//         token: { colorPrimary: '#13c2c2', borderRadius: 12 },
//         components: { Button: { fontWeight: 600 } }
//       }}
//     >
//       <div className="animate-fade-in">
        
//         {/* --- STATS GRID (READ ONLY) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
//           <StatCard 
//             label="Credit Limit" 
//             value={balanceData.creditLimit} 
//             icon={<WalletOutlined />} 
//             color="text-blue-600"
//             bgColor="bg-blue-50"
//             helpText="Total allowed credit limit"
//           />

//           <StatCard 
//             label="Transfer Balance" 
//             value={balanceData.transferBalance} 
//             icon={<BankOutlined />} 
//             color="text-gray-600"
//             bgColor="bg-gray-50"
//             helpText="Funds transferred manually"
//           />

//           <StatCard 
//             label="Issued Policies" 
//             value={balanceData.issuedPolicies} 
//             icon={<FileDoneOutlined />} 
//             color="text-orange-500"
//             bgColor="bg-orange-50"
//             helpText="Total cost utilized so far"
//           />

//           <StatCard 
//             label="Remaining Balance" 
//             value={balanceData.remainingBalance} 
//             icon={<DollarCircleOutlined />} 
//             color="text-emerald-500"
//             bgColor="bg-emerald-50"
//             helpText="Available funds for new policies"
//           />
          
//         </div>

//         {/* --- ACTION BUTTON --- */}
//         <div className="flex justify-end">
//           <Button 
//             type="primary" 
//             onClick={fetchBalanceData} 
//             loading={loading}
//             icon={<ReloadOutlined />} 
//             size="large"
//             className="bg-[#10314a] hover:!bg-[#0a2339] border-none px-8 h-12 shadow-lg hover:shadow-xl text-base"
//           >
//             {loading ? 'Syncing...' : 'Refresh Balance'}
//           </Button>
//         </div>

//       </div>
//     </ConfigProvider>
//   );
// };

// export default RefreshBalanceForm;
import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, message, Row, Col } from 'antd';
import { 
  ReloadOutlined, 
  WalletOutlined, 
  BankOutlined, 
  FileDoneOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import { getMyBranchFinancialApi } from '../../../api/branch'; 

const RefreshBalanceForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    creditLimit: 0,
    transferBalance: 0,
    issuedPolicies: 0,
    remainingBalance: 0
  });

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const res = await getMyBranchFinancialApi();
      if (res.success && res.data) {
        const branch = res.data;
        setData({
          creditLimit: branch.creditTrial || 0,
          transferBalance: 0, 
          issuedPolicies: branch.issuedPolicyAmount || 0,
          remainingBalance: branch.remainingBalance || 0
        });
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Failed to fetch branch financials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData(); 
  }, []);

  const handleRefresh = () => {
    fetchFinancialData(); 
  };

  
  const ColorfulCard = ({ title, value, icon, bgClass, shadowClass }) => (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6 
        flex items-center justify-between 
        shadow-lg ${shadowClass} ${bgClass} 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        min-h-[130px] w-full
      `}
    >
      <div className="z-10 text-white flex-1 min-w-0 pr-4">
        <p className="font-medium text-white/80 text-xs sm:text-sm mb-1 uppercase tracking-wider truncate">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-white m-0 tracking-tight leading-none truncate" title={value.toLocaleString()}>
          {value.toLocaleString()}
        </h3>
        <span className="text-[10px] text-white/60 font-medium mt-2 block">PKR</span>
      </div>

     
      <div className="z-10 shrink-0">
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shadow-sm border border-white/10">
          {React.cloneElement(icon, { style: { fontSize: '24px', color: 'white' } })}
        </div>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: '#13c2c2', borderRadius: 8, fontFamily: "'Inter', sans-serif" } }}
    >
      <div className="animate-fade-in w-full">
     
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#10314a] m-0">Balance Overview</h1>
            <p className="text-gray-500 mt-1 text-sm">Real-time credit and expense tracking.</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<ReloadOutlined />} 
            loading={loading}
            onClick={handleRefresh}
            className="bg-[#10314a] hover:!bg-[#0a2339] border-none h-10 px-6 font-semibold shadow-md"
          >
            Refresh Balance
          </Button>
        </div>

    
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} xl={6}>
            <ColorfulCard 
              title="Credit Limit" 
              value={data.creditLimit} 
              icon={<WalletOutlined />} 
              bgClass="bg-gradient-to-br from-[#17BDB8] via-[#14A3A0] to-[#0F7F7C]" 
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ColorfulCard 
              title="Issued Policies" 
              value={data.issuedPolicies} 
              icon={<FileDoneOutlined />} 
              bgClass="bg-gradient-to-br from-[#102A3C] via-[#123A52] to-[#0B1F2E]" 
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ColorfulCard 
              title="Transfer Balance" 
              value={data.transferBalance} 
              icon={<BankOutlined />} 
              bgClass="bg-gradient-to-br from-[#0D4A52] via-[#0F5E66] to-[#0A3A40]" 
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ColorfulCard 
              title="Remaining Balance" 
              value={data.remainingBalance} 
              icon={<DollarCircleOutlined />} 
              bgClass="bg-gradient-to-br from-[#204B6B] via-[#2A628D] to-[#183A55]" 
            />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default RefreshBalanceForm;