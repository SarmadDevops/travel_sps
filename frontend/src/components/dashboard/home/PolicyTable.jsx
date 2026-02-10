import React, { useState } from "react";
import { Table, ConfigProvider, Button, Tooltip, Tag, Select, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";

const customStyles = `
  /* ✅ EXACT GREEN SCROLLBAR (Fixed) */
  .policy-table-scroll .ant-table-body::-webkit-scrollbar,
  .policy-table-scroll .ant-table-content::-webkit-scrollbar,
  .policy-table-scroll .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }

  .policy-table-scroll .ant-table-body::-webkit-scrollbar-track,
  .policy-table-scroll .ant-table-content::-webkit-scrollbar-track,
  .policy-table-scroll .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important; /* Very light mint track */
    border-radius: 4px;
  }

  .policy-table-scroll .ant-table-body::-webkit-scrollbar-thumb,
  .policy-table-scroll .ant-table-content::-webkit-scrollbar-thumb,
  .policy-table-scroll .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important; /* ✅ Brand Teal Thumb */
    border-radius: 6px !important;
    border: 2px solid #e6fffb;
  }

  .policy-table-scroll .ant-table-body::-webkit-scrollbar-thumb:hover,
  .policy-table-scroll .ant-table-content::-webkit-scrollbar-thumb:hover,
  .policy-table-scroll .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important; 
    cursor: grab;
  }

  /* Firefox Support */
  .policy-table-scroll .ant-table-body,
  .policy-table-scroll .ant-table-content {
    scrollbar-width: thin !important;
    scrollbar-color: #13c2c2 #e6fffb !important;
  }

  /* Pagination Fixes */
  .ant-pagination-options .ant-select-selection-search {
    display: none !important;
  }
  .ant-pagination-options .ant-select-selector {
    cursor: pointer !important;
  }
  .ant-pagination .ant-pagination-item, 
  .ant-pagination .ant-pagination-prev, 
  .ant-pagination .ant-pagination-next {
    margin-right: 8px !important;
    border-radius: 6px !important;
    border-color: #e5e7eb !important;
  }
  .ant-pagination .ant-pagination-item-active {
    background-color: #13c2c2 !important;
    border-color: #13c2c2 !important;
  }
  .ant-pagination .ant-pagination-item-active a {
    color: white !important;
  }
  .ant-pagination .ant-pagination-item:hover:not(.ant-pagination-item-active) {
    border-color: #13c2c2 !important;
    color: #13c2c2 !important;
  }
`;

const PolicyTable = ({
  data,
  readOnly = false,
  basePath = "/dashboard/policy-view",
}) => {
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetails = (record) => {
    navigate(`${basePath}/${record.key}`, {
      state: {
        policyData: record.originalData || record,
        readOnly,
      },
    });
  };

  const currentData = data ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const columns = [
    {
      title: "S.No",
      key: "serialNo",
      width: 70,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Policy No",
      dataIndex: "policyNo",
      key: "policyNo",
      width: 140,
      render: (text) => <span className="font-bold text-[#10314a]">{text}</span>,
    },
    {
      title: "Name Of Insured",
      dataIndex: "insuredName",
      key: "insuredName",
      width: 200,
      render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
      title: "Producer Name",
      dataIndex: "producerName",
      key: "producerName",
      width: 200,
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 110,
      align: "center",
      render: (status) => (
        <Tag
          color={status === "PAID" ? "blue" : "red"}
          className="min-w-[70px] text-center font-bold rounded-full py-0.5 border-none"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      align: "center",
      render: (status) => (
        <Tag
          color={status === "POSTED" ? "green" : "volcano"}
          className="min-w-[70px] text-center font-bold rounded-full py-0.5"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Tooltip title="View Further Details">
          <Button
            size="small"
            className="text-[#13c2c2] border-[#13c2c2] hover:bg-teal-50 flex items-center gap-1 mx-auto"
            onClick={() => handleViewDetails(record)}
          >
            <EyeOutlined /> View
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <style>{customStyles}</style>

      <ConfigProvider
        theme={{
          token: { colorPrimary: "#13c2c2" },
          components: {
            Table: {
              headerColor: "white",
              headerBg: "transparent",
              borderColor: "#e5e7eb",
              headerBorderRadius: 8,
              cellPaddingBlock: 12,
              rowHoverBg: "#f0fdfa",
            },
          },
        }}
      >
        {/* ✅ Wrapper class 'policy-table-scroll' ensures CSS targets this table specifically */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col policy-table-scroll">
          
          <Table
            columns={columns}
            dataSource={currentData}
            rowKey="key"
            bordered={false}
            scroll={{ x: 1000 }}
            pagination={false} 
            components={{
              header: {
                row: (props) => (
                  <tr {...props} style={{ background: headerGradient }} />
                ),
                cell: (props) => (
                  <th
                    {...props}
                    style={{
                      ...props.style,
                      background: "transparent",
                      color: "white",
                      fontWeight: 600,
                      padding: "12px 16px",
                    }}
                  />
                ),
              },
            }}
          />

          <div className="flex flex-col sm:flex-row justify-end items-center p-4 gap-4 border-t border-gray-100 bg-gray-50">
            
            <span className="text-gray-500 text-sm hidden sm:block">
               Showing {(currentPage - 1) * pageSize + 1}-
               {Math.min(currentPage * pageSize, data?.length || 0)} of {data?.length}
            </span>

            <Pagination
              current={currentPage}
              total={data?.length || 0}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />

            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              size="middle"
              className="w-[110px]"
              showSearch={false} 
            >
              <Option value={5}>5 / page</Option>
              <Option value={10}>10 / page</Option>
              <Option value={20}>20 / page</Option>
              <Option value={30}>30 / page</Option>
              <Option value={50}>50 / page</Option>
            </Select>

          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default PolicyTable;