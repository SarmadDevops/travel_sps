import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  Button,
  Tooltip,
  Tag,
  Pagination,
  Select,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";

const branchScrollStyles = `
  .branch-table-wrapper .ant-table-body::-webkit-scrollbar,
  .branch-table-wrapper .ant-table-content::-webkit-scrollbar,
  .branch-table-wrapper .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }
  .branch-table-wrapper .ant-table-body::-webkit-scrollbar-track,
  .branch-table-wrapper .ant-table-content::-webkit-scrollbar-track,
  .branch-table-wrapper .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important;
    border-radius: 4px;
  }
  .branch-table-wrapper .ant-table-body::-webkit-scrollbar-thumb,
  .branch-table-wrapper .ant-table-content::-webkit-scrollbar-thumb,
  .branch-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important;
    border-radius: 6px !important;
    border: 2px solid #e6fffb;
  }
  .branch-table-wrapper .ant-table-body::-webkit-scrollbar-thumb:hover,
  .branch-table-wrapper .ant-table-content::-webkit-scrollbar-thumb:hover,
  .branch-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important;
    cursor: grab;
  }
  .branch-table-wrapper .ant-table-body,
  .branch-table-wrapper .ant-table-content {
    scrollbar-width: thin !important;
    scrollbar-color: #13c2c2 #e6fffb !important;
  }
  /* Pagination Styles */
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

const BranchTable = ({ data }) => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetails = (record) => {
    navigate(`/dashboard/branch-details/${record.key}`, {
      state: { branchData: record },
    });
  };

  const currentData = data
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const columns = [
    {
      title: "Branch Code",
      dataIndex: "branchCode",
      key: "branchCode",
      width: 150,
      align: "center",
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      width: 250,
      align: "center",
    },
    {
      title: "Admin Name",
      dataIndex: "adminName",
      key: "adminName",
      align: "center",
      render: (text) => (
        <span className="text-gray-600 font-medium">{text}</span>
      ),
    },
    {
      title: "Credit Limit",
      dataIndex: "creditTrial",
      key: "creditTrial",
      align: "center",
      render: (amount) => (
        <Tag
          color="cyan"
          className="px-3 py-1 rounded-full text-sm font-semibold"
        >
          {amount}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      width: 120,
      render: (isActive) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? "success" : "error"}
          className="px-3 py-1 rounded-full text-sm font-medium"
        >
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="border-[#13c2c2] text-[#13c2c2] hover:bg-teal-50 hover:text-teal-700"
          >
            View Details
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerColor: "white",
            headerBg: "transparent",
            borderColor: "#e5e7eb",
            headerBorderRadius: 8,
            rowHoverBg: "#f0fdfa",
          },
        },
      }}
    >
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden mt-6 branch-table-wrapper">
        <style>{branchScrollStyles}</style>

        <Table
          columns={columns}
          dataSource={currentData}
          pagination={false}
          scroll={{ x: 800 }}
          bordered={false}
          rowKey="id"
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
                    textAlign: "center",
                    padding: "12px 16px",
                    borderRight: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              ),
            },
          }}
        />

        {/* Custom Footer Pagination */}
        <div className="flex flex-col sm:flex-row justify-end items-center p-4 gap-4 border-t border-gray-100 bg-gray-50">
          <span className="text-gray-500 text-sm hidden sm:block">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, data?.length || 0)} of{" "}
            {data?.length || 0}
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
          </Select>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BranchTable;
