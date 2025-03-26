import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Avatar,
  Divider,
  Tag,
  Typography,
  Button,
} from "antd";
import { profileService } from "./../../service/profileService";
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  Username: string;
  UserAttributes: {
    Name: string;
    Value: string;
  }[];
}

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await profileService.getProfile();
        setProfile(response.data);
      } catch (error) {
        message.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getAttributeValue = (name: string) => {
    return (
      profile?.UserAttributes.find((attr) => attr.Name === name)?.Value || "N/A"
    );
  };

  const { Title, Text } = Typography;
  return (
    <>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
      ) : (
        <>
          <Button
            className="mb-6"
            type="primary"
            onClick={() => navigate("/updateprofile")}
          >
            Edit Profile
          </Button>
          <Card
            bordered={false}
            cover={
              <img
                alt="Profile Cover"
                src="https://images.unsplash.com/photo-1503264116251-35a269479413"
                style={{
                  borderRadius: "12px 12px 0 0",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            }
          >
            <div style={{ textAlign: "center", marginTop: -50 }}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{
                  border: "4px solid white",
                  backgroundColor: "#1890ff",
                }}
              />
              <Title level={3} style={{ marginTop: 12 }}>
                {profile?.Username || "N/A"}
              </Title>
              <Tag color="blue">{getAttributeValue("custom:userType")}</Tag>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Email:</Text>
                <p>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {getAttributeValue("email")}
                </p>
              </Col>
              <Col span={12}>
                <Text strong>Address:</Text>
                <p>
                  <HomeOutlined style={{ marginRight: 8 }} />
                  {getAttributeValue("address")}
                </p>
              </Col>

              <Col span={12}>
                <Text strong>Family Name:</Text>
                <p>{getAttributeValue("family_name")}</p>
              </Col>
              <Col span={12}>
                <Text strong>Given Name:</Text>
                <p>{getAttributeValue("given_name")}</p>
              </Col>

              <Col span={12}>
                <Text strong>Gender:</Text>
                <p>{getAttributeValue("gender")}</p>
              </Col>
              <Col span={12}>
                <Text strong>Birthdate:</Text>
                <p>{getAttributeValue("birthdate")}</p>
              </Col>

              <Col span={12}>
                <Text strong>Country:</Text>
                <p>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {getAttributeValue("custom:country")}
                </p>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
};

export default ProfileView;
