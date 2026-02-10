import React, { useEffect, useState } from "react";
import { Table, Tag, message, ConfigProvider } from "antd";
import { getBranchUnpaidPoliciesApi } from "../../../api/underWriting";

const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";


const refreshTableScrollStyles = `
  /* 1. Webkit Scrollbar */
  .refresh-table-wrapper .ant-table-body::-webkit-scrollbar,
  .refresh-table-wrapper .ant-table-content::-webkit-scrollbar,
  .refresh-table-wrapper .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }

  /* 2. Track (Background) */
  .refresh-table-wrapper .ant-table-body::-webkit-scrollbar-track,
  .refresh-table-wrapper .ant-table-content::-webkit-scrollbar-track,
  .refresh-table-wrapper .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important; /* Very light mint track */
    border-radius: 4px;
  }

  /* 3. Thumb (The moving part) - Light Green/Teal */
  .refresh-table-wrapper .ant-table-body::-webkit-scrollbar-thumb,
  .refresh-table-wrapper .ant-table-content::-webkit-scrollbar-thumb,
  .refresh-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important; /* Light Green / Brand Teal */
    border-radius: 6px !important;
    border: 2px solid #e6fffb; /* Adds a nice 'floating' effect */
  }

  /* 4. Hover State */
  .refresh-table-wrapper .ant-table-body::-webkit-scrollbar-thumb:hover,
  .refresh-table-wrapper .ant-table-content::-webkit-scrollbar-thumb:hover,
  .refresh-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important; /* Slightly darker on hover */
    cursor: grab;
  }

  /* 5. Firefox Support */
  .refresh-table-wrapper .ant-table-body,
  .refresh-table-wrapper .ant-table-content {
    scrollbar-width: thin !important;
    scrollbar-color: #13c2c2 #e6fffb !important;
  }
`;

const RefreshBalanceTable = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Policy Number",
      dataIndex: "policyNumber",
      key: "policyNumber",
      render: (text) => (
        <span className="font-semibold text-[#10314a]">{text}</span>
      ),
    },
    {
      title: "Name of Insured",
      dataIndex: "insuredName",
      key: "insuredName",
    },
    {
      title: "Producer Name",
      key: "producer",
      render: (_, record) => <span>{record.User?.name || "—"}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "UNPAID" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (status) => (
        <Tag color={status === "UNPOSTED" ? "orange" : "blue"}>{status}</Tag>
      ),
    },
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await getBranchUnpaidPoliciesApi();

     
      const formattedData = data.map((item) => ({
        ...item,
        key: item.id,
      }));

      setPolicies(formattedData);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
 
    <div className="bg-white p-6 rounded-2xl shadow-lg refresh-table-wrapper">
      
     
      <style>{refreshTableScrollStyles}</style>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#10314a]">Unpaid Policies</h3>
        <p className="text-sm text-gray-400">Branch unpaid policy list</p>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "#e5e7eb",
              headerColor: "white",
              rowHoverBg: "#f0fdfa",
            },
          },
        }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table
            columns={columns}
            dataSource={policies}
            loading={loading}
            pagination={false}
            scroll={{ x: 800 }}
            expandable={{ expandIcon: () => null }}
            components={{
                header: {
                row: (props) => (
                    <tr
                    {...props}
                    style={{ background: headerGradient, border: "none" }}
                    />
                ),
                cell: (props) => (
                    <th
                    {...props}
                    style={{
                        ...props.style,
                        background: "transparent",
                        color: "white",
                        fontWeight: 600,
                        textAlign: "left", // Default alignment
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        padding: "12px 16px",
                        fontSize: "0.9rem",
                    }}
                    />
                ),
                },
            }}
            />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default RefreshBalanceTable;