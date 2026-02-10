import React, { useState } from "react";
import { Table, ConfigProvider, Button, Tooltip, Modal, message, Select, Pagination } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import EditPackageModal from "./EditPackageModal"; 

const { Option } = Select;
const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";
const { confirm } = Modal;

const packageTableStyles = `
  /* 1.  EXACT GREEN SCROLLBAR (Fixed specifically for Package Table) */
  .package-table-scroll .ant-table-body::-webkit-scrollbar,
  .package-table-scroll .ant-table-content::-webkit-scrollbar,
  .package-table-scroll .ant-table-scroll::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }

  .package-table-scroll .ant-table-body::-webkit-scrollbar-track,
  .package-table-scroll .ant-table-content::-webkit-scrollbar-track,
  .package-table-scroll .ant-table-scroll::-webkit-scrollbar-track {
    background: #e6fffb !important; /* Very light mint track */
    border-radius: 4px;
  }

  .package-table-scroll .ant-table-body::-webkit-scrollbar-thumb,
  .package-table-scroll .ant-table-content::-webkit-scrollbar-thumb,
  .package-table-scroll .ant-table-scroll::-webkit-scrollbar-thumb {
    background-color: #13c2c2 !important; /* ✅ Brand Teal Thumb */
    border-radius: 6px !important;
    border: 2px solid #e6fffb;
  }

  .package-table-scroll .ant-table-body::-webkit-scrollbar-thumb:hover,
  .package-table-scroll .ant-table-content::-webkit-scrollbar-thumb:hover,
  .package-table-scroll .ant-table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #08979c !important;
    cursor: grab;
  }

  /* Firefox Support */
  .package-table-scroll .ant-table-body,
  .package-table-scroll .ant-table-content {
    scrollbar-width: thin !important;
    scrollbar-color: #13c2c2 #e6fffb !important;
  }

  /* 2. Pagination Fixes (No Typing, Hand Cursor) */
  .ant-pagination-options .ant-select-selection-search {
    display: none !important;
  }
  .ant-pagination-options .ant-select-selector {
    cursor: pointer !important;
  }
  
  /* 3. Pagination Button Spacing */
  .ant-pagination .ant-pagination-item, 
  .ant-pagination .ant-pagination-prev, 
  .ant-pagination .ant-pagination-next {
    margin-right: 8px !important;
    border-radius: 6px !important;
    border-color: #e5e7eb !important;
  }
  
  /* Active Page Style */
  .ant-pagination .ant-pagination-item-active {
    background-color: #13c2c2 !important;
    border-color: #13c2c2 !important;
  }
  .ant-pagination .ant-pagination-item-active a {
    color: white !important;
  }
  
  /* Hover Style */
  .ant-pagination .ant-pagination-item:hover:not(.ant-pagination-item-active) {
    border-color: #13c2c2 !important;
    color: #13c2c2 !important;
  }
`;

const PackageTable = ({
  columns,
  data,
  title = "Current Rates",
  onUpdateAPI,
  onDeleteAPI,
  minWidth = "max-content",
  showActions = true,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingRow, setCurrentEditingRow] = useState(null);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

 
  const currentData = data ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const onEditClick = (record) => {
    setCurrentEditingRow(record);
    setIsEditModalOpen(true);
  };

  const handleUpdateSave = async (updatedValues) => {
    if (onUpdateAPI) {
      await onUpdateAPI(updatedValues);
    } else {
      console.log("No API handler provided. Updated:", updatedValues);
      message.success("Package updated (UI Only)");
    }
    setIsEditModalOpen(false);
  };

  const onDeleteClick = (record) => {
    confirm({
      title: "Are you sure delete this package?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently remove the ${record.duration} package.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (onDeleteAPI) {
          onDeleteAPI(record.key);
        } else {
          message.success("Package deleted (UI Only)");
        }
      },
    });
  };

  const tableColumns = [
    ...columns,
    ...(showActions
      ? [
          {
            title: "Action",
            key: "action",
            width: 100,
            align: "center",
            render: (_, record) => (
              <div className="flex justify-center gap-2">
                <Tooltip title="Edit Package">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="text-[#13c2c2] hover:bg-teal-50"
                    onClick={() => onEditClick(record)}
                  />
                </Tooltip>
                <Tooltip title="Delete Package">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="hover:bg-red-50"
                    onClick={() => onDeleteClick(record)}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
      <style>{packageTableStyles}</style>

      <div className="mb-5">
        <h3 className="text-xl font-bold text-[#10314a]">{title}</h3>
        <p className="text-gray-500 text-sm">
          Active pricing structure for this category.
        </p>
      </div>

      <ConfigProvider
        theme={{
          token: { colorPrimary: "#13c2c2" },
          components: {
            Table: {
              borderColor: "#e5e7eb",
              headerBorderRadius: 8,
              headerColor: "white",
              cellFontSize: 14,
              rowHoverBg: "#f0fdfa",
              headerBg: "transparent",
            },
          },
        }}
      >
      
        <div className="overflow-hidden rounded-lg border border-gray-200 package-table-scroll flex flex-col">
            
            <Table
            columns={tableColumns}
            dataSource={currentData} 
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
                        fontWeight: "600",
                        textAlign: "center",
                        verticalAlign: "middle",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        borderBottom: "1px solid rgba(255,255,255,0.2)",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        fontSize: "0.8rem",
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
                    <Option value={50}>50 / page</Option>
                </Select>

            </div>
        </div>
      </ConfigProvider>

      <EditPackageModal
        visible={isEditModalOpen}
        initialValues={currentEditingRow}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateSave}
      />
    </div>
  );
};

export default PackageTable;