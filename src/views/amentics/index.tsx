import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  message,
  Popconfirm,
  Image,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { amenityService } from "../../service/amenityService";
import MainLayout from "../../component/MainLayout";
import AddAmenityModal from "./addAmeticesModal";
import { useNavigate } from "react-router-dom";

const Amentics: React.FC = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const response = await amenityService.getAmenities();
      setAmenities(response.data.amenities);
    } catch (error) {
      message.error("Failed to fetch amenities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await amenityService.deleteAmenity(id);
      message.success("Amenity deleted successfully");
      fetchAmenities();
    } catch (error) {
      message.error("Failed to delete amenity");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (url: string) =>
        url ? <Image src={url} width={50} height={50} /> : "No Image",
    },
    { title: "Amenity Name", dataIndex: "name", key: "name" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Popconfirm
            title="Are you sure you want to delete this amenity?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="h-auto"
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <MainLayout>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={12} sm={12}>
          <h2 style={{ marginBottom: "16px" }}>Manage Amenities</h2>
        </Col>
        <Col xs={24} sm={12} md={12} className="text-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ minHeight: 40 }}
            onClick={() => setModalVisible(true)}
          >
            Add New Amenity
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={24}>
          <Card title="Amenities List" bordered={true}>
            <Table
              columns={columns}
              dataSource={amenities}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
      <AddAmenityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchAmenities}
      />
    </MainLayout>
  );
};

export default Amentics;
