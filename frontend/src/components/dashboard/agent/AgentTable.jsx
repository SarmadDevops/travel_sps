import React, { useState, useMemo } from "react";
import { Table, ConfigProvider, Input, Pagination, Select, Tag, Button, Tooltip } from "antd";
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";

const agentTableStyles = `
  /* Scrollbar Styles */
  .agent-table-wrapper .ant-table-body::-webkit-scrollbar,
  .agent-table-wrapper .ant-table-content::-webkit-scrollbar,
  .agent-table-wrapper .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }
  .agent-table-wrapper .ant-table-body::-webkit-scrollbar-track,
  .agent-table-wrapper .ant-table-content::-webkit-scrollbar-track,
  .agent-table-wrapper .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important;
    border-radius: 4px;
  }
  .agent-table-wrapper .ant-table-body::-webkit-scrollbar-thumb,
  .agent-table-wrapper .ant-table-content::-webkit-scrollbar-thumb,
  .agent-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important;
    border-radius: 6px !important;
    border: 2px solid #e6fffb;
  }
  .agent-table-wrapper .ant-table-body::-webkit-scrollbar-thumb:hover,
  .agent-table-wrapper .ant-table-content::-webkit-scrollbar-thumb:hover,
  .agent-table-wrapper .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important;
    cursor: grab;
  }
  
  /* Firefox Support */
  .agent-table-wrapper .ant-table-body,
  .agent-table-wrapper .ant-table-content {
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

const AgentTable = ({
  data = [],
  loading = false,
  minWidth = "1000px", 
  onView, 
  isBranchView = false, 
}) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  
  const columns = [
    { 
      title: "Agent Code", 
      dataIndex: "agentCode", 
      key: "agentCode", 
      width: 120,
      align: "center",
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>
    },
    { 
      title: "Agent Name", 
      dataIndex: "agentName", 
      key: "agentName", 
      width: 180,
      align: "center"
    },
    { 
      title: "CNIC", 
      dataIndex: "agentCnic", 
      key: "agentCnic", 
      width: 150,
      align: "center",
      render: (text) => <span className="text-gray-600">{text || "-"}</span>
    },
    { 
      title: "Mobile No", 
      dataIndex: "mobileNo", 
      key: "mobileNo", 
      width: 140,
      align: "center",
      render: (text) => <span className="text-gray-600">{text || "-"}</span>
    },
   
    {
      title: "Commission",
      dataIndex: "commissionSlab",
      key: "commissionSlab",
      width: 120,
      align: "center",
     render: (val) => {
  if (!val) return "0%";
  if (typeof val === "string" && val.includes("%")) return val;
  return `${val}%`;
},

    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email", 
      width: 200,
      align: "center"
    },
  ];

 
  if (isBranchView) {
    columns.push(
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: 120,
        align: "center",
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
        title: "View",
        key: "view",
        width: 100,
        align: "center",
        render: (_, record) => (
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              className="border-[#13c2c2] text-[#13c2c2] hover:bg-teal-50"
              onClick={() => onView && onView(record)}
            >
              View
            </Button>
          </Tooltip>
        ),
      }
    );
  }

 
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lowerSearch = searchText.toLowerCase();
    return data.filter(
      (item) =>
        item.agentName?.toLowerCase().includes(lowerSearch) ||
        item.agentCode?.toLowerCase().includes(lowerSearch) ||
        item.email?.toLowerCase().includes(lowerSearch) ||
        item.agentCnic?.toLowerCase().includes(lowerSearch) ||
        item.mobileNo?.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, data]);

 
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

 
  const currentData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-gray-100 mt-8">
      <style>{agentTableStyles}</style>

      {/* Header: Title & Search */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#10314a]">Agent List</h3>
          <p className="text-gray-500 text-sm">
            Active agent records in the system.
          </p>
        </div>
        <Input
          placeholder="Search name, code, CNIC or mobile..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 320 }}
          className="rounded-lg h-10 shadow-sm"
        />
      </div>

      <ConfigProvider
        theme={{
          token: { colorPrimary: "#13c2c2" },
          components: {
            Table: {
              borderColor: "#e5e7eb",
              headerColor: "white",
              rowHoverBg: "#f0fdfa",
              headerBg: "transparent",
            },
            Pagination: {
              itemActiveBg: "#e6fffb",
              itemActiveBorderColor: "#13c2c2",
            },
          },
        }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 agent-table-wrapper flex flex-col">
          <Table
            columns={columns}
            dataSource={currentData}
            loading={loading}
            rowKey="id"
            pagination={false}
            bordered
            scroll={{ x: minWidth }}
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
                      textAlign: "center",
                      borderRight: "1px solid rgba(255,255,255,0.2)",
                      padding: "12px 16px",
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
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </span>
            <Pagination
              current={currentPage}
              total={filteredData.length}
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
    </div>
  );
};

export default AgentTable;