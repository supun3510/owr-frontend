import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Upload, Image } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { amenityService } from "../../service/amenityService";

interface AddAmenityModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAmenityModal: React.FC<AddAmenityModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ✅ Handle File Change (Keep only one file)
  const handleFileChange = ({ fileList }: { fileList: any[] }) => {
    const latestFile = fileList.slice(-1); // Only keep the latest uploaded image
    setFileList(latestFile);

    if (latestFile.length > 0) {
      const file = latestFile[0];
      const url = URL.createObjectURL(file.originFileObj);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  // ✅ Remove uploaded image
  const handleRemove = () => {
    setFileList([]);
    setPreviewImage(null);
  };

  // ✅ Ensure only images are uploaded
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Please upload a valid image file!");
      return Upload.LIST_IGNORE;
    }
    return isImage;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Please upload an image file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      await amenityService.addAmenity(formData);
      message.success("Amenity added successfully!");
      form.resetFields();
      setFileList([]);
      setPreviewImage(null);
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Failed to add amenity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Amenity"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add Amenity
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Name Input */}
        <Form.Item
          name="name"
          label="Amenity Name"
          rules={[{ required: true, message: "Please enter amenity name" }]}
        >
          <Input placeholder="Enter amenity name" />
        </Form.Item>

        {/* Image Upload with Drag & Drop + Preview */}
        <Form.Item label="Upload Image">
          <Upload.Dragger
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            showUploadList={false} // ✅ Hide default Ant Design file list
            accept="image/*"
            style={{
              padding: "20px",
              border: previewImage ? "2px solid #1890ff" : "1px dashed #d9d9d9",
              borderRadius: "8px",
              textAlign: "center",
              background: previewImage ? "rgba(0,0,0,0.05)" : "white",
            }}
          >
            {previewImage ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <Image
                  src={previewImage}
                  alt="Uploaded"
                  width={200}
                  height={200}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemove}
                  size="small"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "red",
                    border: "none",
                  }}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <UploadOutlined
                  style={{ fontSize: "24px", color: "#1890ff" }}
                />
                <p style={{ marginTop: "10px" }}>
                  Drag & Drop or Click to Upload
                </p>
              </div>
            )}
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAmenityModal;
