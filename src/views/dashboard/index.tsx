import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Spin,
  message,
  Modal,
  Switch,
  Descriptions,
  Button,
} from "antd";
import {
  HomeOutlined,
  DollarCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../component/MainLayout";
import { productService } from "../../service/productService";
import updateRequestStatus from "../../service/productService";

const Dashboard: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [requestsowner, setRequestsowner] = useState([]);

  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  const columns = [
    {
      title: "Sender",
      dataIndex: "recipient",
      key: "recipient",
      render: (recipient) => `${recipient.first_name} ${recipient.last_name}`,
    },
    {
      title: "Email",
      dataIndex: "recipient",
      key: "email",
      render: (recipient) => recipient.email,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => product.name,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message) =>
        message.length > 100 ? `${message.slice(0, 70)}...` : message,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  const columnsowner = [
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (owner) =>
        owner ? `${owner.first_name} (${owner.email})` : "N/A",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message) =>
        message.length > 100 ? `${message.slice(0, 100)}...` : message,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "accepted"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setUserType(userType);

    if (userType === "LANDOWNER") {
      fetchLandownerRequests();
    } else if (userType === "INVESTOR") {
      fetchContactRequests();
    }
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleStatusChange = async (newStatus) => {
    const userType = localStorage.getItem("userType");
    if (!selectedRequest) return;

    setLoading(true);

    try {
      await productService.updateRequestStatus(selectedRequest.id, newStatus);

      // ✅ Correctly Update State
      setRequestsOwner((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: newStatus } : req
        )
      );

      message.success(`Request has been ${newStatus}!`);
    } catch (error) {
      console.error("Error updating request status:", error);
      message.error("Failed to update request status.");
    } finally {
      // ✅ Fetch latest data based on user type
      if (userType === "LANDOWNER") {
        await fetchLandownerRequests?.();
      } else if (userType === "INVESTOR") {
        await fetchContactRequests?.();
      }

      setLoading(false);
      setModalVisible(false);
      setSelectedRequest(null);
    }
  };

  // Open Modal with Full Details
  const openModal = (record) => {
    setSelectedRequest(record);
    setModalVisible(true);
  };

  const fetchContactRequests = async () => {
    setLoading(true);
    try {
      const data = await productService.getContactRequests();
      setRequests(data);
    } catch (error) {
      message.error("Failed to fetch contact requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchLandownerRequests = async () => {
    setLoading(true);
    try {
      const data = await productService.getLandownerRequests();
      setRequestsowner(data);
    } catch (error) {
      message.error("Failed to fetch landowner requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h2 style={{ marginBottom: "16px" }}>🏡 Property Management Dashboard</h2>

      {/* Top Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ background: "#1890ff", color: "white" }}
          >
            <Statistic
              title="Total Properties"
              value={120}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ background: "#52c41a", color: "white" }}
          >
            <Statistic
              title="Properties Available"
              value={35}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ background: "#faad14", color: "white" }}
          >
            <Statistic
              title="Active Properties"
              value={85}
              prefix={<UserOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ background: "#ff4d4f", color: "white" }}
          >
            <Statistic
              title="Total Investment"
              value={"$24,500"}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
      </Row>

      {userType === "INVESTOR" && (
        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} sm={24}>
            <Card title="🏠 My Recent Contact Requests" bordered={true}>
              <div>
                {loading ? (
                  <Spin
                    size="large"
                    style={{ display: "block", margin: "20px auto" }}
                  />
                ) : (
                  <Table columns={columns} dataSource={requests} rowKey="id" />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {userType === "LANDOWNER" && (
        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} sm={24}>
            <Card title="🏠 Recent Contact Requests" bordered={true}>
              <div>
                {loading ? (
                  <Spin
                    size="large"
                    style={{ display: "block", margin: "20px auto" }}
                  />
                ) : (
                  <>
                    <Table
                      columns={columnsowner}
                      dataSource={requestsowner}
                      rowKey="id"
                    />

                    <Modal
                      title="Request Details"
                      visible={modalVisible}
                      onCancel={() => setModalVisible(false)}
                      footer={[
                        <Button
                          key="cancel"
                          onClick={() => setModalVisible(false)}
                        >
                          Cancel
                        </Button>,
                        <Button
                          key="reject"
                          danger
                          onClick={() => handleStatusChange("rejected")}
                        >
                          Reject
                        </Button>,
                        <Button
                          key="accept"
                          type="primary"
                          onClick={() => handleStatusChange("accepted")}
                        >
                          Accept
                        </Button>,
                      ]}
                    >
                      {selectedRequest && (
                        <Descriptions bordered column={1}>
                          <Descriptions.Item label="Owner Name">
                            {selectedRequest.owner?.first_name}
                          </Descriptions.Item>
                          <Descriptions.Item label="Owner Email">
                            {selectedRequest.owner?.email}
                          </Descriptions.Item>
                          <Descriptions.Item label="Message">
                            {selectedRequest.message}
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Tag
                              color={
                                selectedRequest.status === "pending"
                                  ? "orange"
                                  : selectedRequest.status === "accepted"
                                  ? "green"
                                  : "red"
                              }
                            >
                              {selectedRequest.status}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Created At">
                            {selectedRequest.created_at}
                          </Descriptions.Item>
                        </Descriptions>
                      )}
                    </Modal>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </MainLayout>
  );
};

export default Dashboard;
