import React from "react";
import { Table, ConfigProvider } from "antd";

const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";

// ✅ Updated: Light Green / Teal Scrollbar (Brand Theme)
const coverageScrollStyles = `
  /* 1. Webkit Scrollbar */
  .coverage-table-wrapper .ant-table-body::-webkit-scrollbar,
  .coverage-table-wrapper .ant-table-content::-webkit-scrollbar,
  .coverage-table-wrapper .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }

  /* 2. Track (Background) */
  .coverage-table-wrapper .ant-table-body::-webkit-scrollbar-track,
  .coverage-table-wrapper .ant-table-content::-webkit-scrollbar-track,
  .coverage-table-wrapper .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important; /* Very light mint track */
    border-radius: 4px;
  }

  /* 3. Thumb (The moving part) - Light Green/Teal */
  .coverage-table-wrapper .ant-table-body::-webkit-scrollbar-thumb,
  .coverage-table-wrapper .ant-table-content::-webkit-scrollbar-thumb,
  .coverage-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important; /* ✅ Light Green / Brand Teal */
    border-radius: 6px !important;
    border: 2px solid #e6fffb; /* Adds a nice 'floating' effect */
  }

  /* 4. Hover State */
  .coverage-table-wrapper .ant-table-body::-webkit-scrollbar-thumb:hover,
  .coverage-table-wrapper .ant-table-content::-webkit-scrollbar-thumb:hover,
  .coverage-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important; /* Slightly darker on hover */
    cursor: grab;
  }

  /* 5. Firefox Support */
  .coverage-table-wrapper .ant-table-body,
  .coverage-table-wrapper .ant-table-content {
    scrollbar-width: thin !important;
    scrollbar-color: #13c2c2 #e6fffb !important;
  }
`;

const columns = [
  {
    title: "Schedule Of Benefits",
    dataIndex: "benefit",
    key: "benefit",
    width: 300, 
    render: (text) => (
      <span className="font-bold text-[#10314a]">{text}</span>
    ),
  },
  {
    title: "Diamond",
    dataIndex: "diamond",
    key: "diamond",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
  {
    title: "Gold",
    dataIndex: "gold",
    key: "gold",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
  {
    title: "Silver",
    dataIndex: "silver",
    key: "silver",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
  {
    title: "Standard",
    dataIndex: "standard",
    key: "standard",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
  {
    title: "Platinum",
    dataIndex: "platinum",
    key: "platinum",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
  {
    title: "Gold Plus",
    dataIndex: "goldPlus",
    key: "goldPlus",
    align: "center",
    width: 150,
    render: (text) => <span className="font-medium text-gray-600">{text}</span>,
  },
];

const data = [
  {
    key: "1",
    benefit: "Medical Expenses & Hospitalization Abroad",
    diamond: "50,000",
    gold: "50,000",
    silver: "25,000",
    standard: "10,000",
    platinum: "100,000",
    goldPlus: "50,000",
  },
  {
    key: "2",
    benefit: "Transport or Repatriation in case of Illness",
    diamond: "Actual Expenses",
    gold: "Actual Expenses",
    silver: "Actual Expenses",
    standard: "Actual Expenses",
    platinum: "Actual Expenses",
    goldPlus: "Actual Expenses",
  },
  {
    key: "3",
    benefit: "Repatriation Of Mortal Remains",
    diamond: "Actual Expenses",
    gold: "Actual Expenses",
    silver: "Actual Expenses",
    standard: "Actual Expenses",
    platinum: "Actual Expenses",
    goldPlus: "Actual Expenses",
  },
  {
    key: "4",
    benefit: "Emergency Dental Care",
    diamond: "600",
    gold: "600",
    silver: "600",
    standard: "600",
    platinum: "600",
    goldPlus: "600",
  },
];

const CoveragePlanForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-4">
      
      <style>{coverageScrollStyles}</style>

      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#10314a]">Coverage Plans</h2>
        <p className="text-gray-500 text-sm">
          Detailed schedule of benefits per plan.
        </p>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "#e5e7eb",
              headerColor: "white",
              headerBg: "transparent",
              headerBorderRadius: 8,
              rowHoverBg: "#f0fdfa", 
            },
          },
        }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 coverage-table-wrapper">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: 1300 }} 
            components={{
              header: {
                row: (props) => (
                  <tr {...props} style={{ background: headerGradient, border: "none" }} />
                ),
                cell: (props) => (
                  <th
                    {...props}
                    style={{
                      ...props.style,
                      background: "transparent",
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "12px 8px",
                      textTransform: "uppercase",
                      fontSize: "0.8rem",
                      borderRight: "1px solid rgba(255,255,255,0.2)",
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

export default CoveragePlanForm;