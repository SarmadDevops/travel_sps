import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message, ConfigProvider } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { updatePolicyApi } from "../../../api/underWriting"; 

const { TextArea } = Input;

const SuperAdminNotesModal = ({
  visible,
  onCancel,
  policyId,
  initialNotes,
  onSuccess
}) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const maxLength = 5000;

  useEffect(() => {
    if (visible) {
      setNotes(initialNotes || "");
    }
  }, [visible, initialNotes]);

  const handleSave = async () => {
    if (!policyId) {
      message.error("Policy ID missing");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        superAdminNotes: notes
      };

      const res = await updatePolicyApi(policyId, payload); // UPDATED API

      message.success(res.message || "Notes updated successfully");

      if (onSuccess) {
        onSuccess(notes); // parent update
      }
  if (location.state?.onUpdate) location.state.onUpdate();
      onCancel(); // modal close
    } catch (error) {
      message.error(error.message || "Failed to update notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#13c2c2"
        }
      }}
    >
      <Modal
        title={
          <div className="flex items-center gap-3 border-b pb-3 mb-4">
            <div className="bg-cyan-50 p-2 rounded-lg text-[#13c2c2]">
              <EditOutlined style={{ fontSize: "18px" }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#10314a] m-0">
                Super Admin Notes
              </h3>
              <p className="text-xs text-gray-400 m-0 font-normal">
                Add internal remarks for this policy
              </p>
            </div>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        centered
        width={600}
        footer={[
          <Button
            key="cancel"
            onClick={onCancel}
            className="hover:!text-[#10314a] hover:!border-[#10314a] h-10 px-6 rounded-lg"
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={loading}
            onClick={handleSave}
            icon={<SaveOutlined />}
            className="bg-[#13c2c2] hover:!bg-teal-600 border-none h-10 px-6 rounded-lg font-semibold shadow-md"
          >
            Save Notes
          </Button>
        ]}
        className="rounded-2xl overflow-hidden"
      >
        <div className="py-2">
          <TextArea
            rows={8}
            placeholder="Write detailed admin notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-base text-[#10314a] bg-gray-50 focus:bg-white rounded-xl border-gray-200 focus:border-[#13c2c2] focus:shadow-sm transition-all p-4"
            maxLength={maxLength}
            style={{ resize: "none" }}
          />

          <div className="text-right mt-2 text-xs text-gray-400 font-medium">
            {notes.length} / {maxLength} characters
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default SuperAdminNotesModal;
