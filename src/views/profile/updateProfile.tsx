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
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import { profileService } from "./../../service/profileService";
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import MainLayout from "../../component/MainLayout";

const { Title, Text } = Typography;
const { Option } = Select;

interface UserProfile {
  Username: string;
  UserAttributes: {
    Name: string;
    Value: string;
  }[];
}

const UpdateProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await profileService.getProfile();
        setProfile(response.data);
        populateForm(response.data);
      } catch (error) {
        message.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Populate Form Fields with Fetched Data
  const populateForm = (data: UserProfile) => {
    form.setFieldsValue({
      username: data.Username,
      email: getAttributeValue("email"),
      family_name: getAttributeValue("family_name"),
      given_name: getAttributeValue("given_name"),
      address: getAttributeValue("address"),
      gender: getAttributeValue("gender"),
      birthdate: dayjs(getAttributeValue("birthdate")),
      country: getAttributeValue("custom:country"),
    });
  };

  const getAttributeValue = (name: string) => {
    return (
      profile?.UserAttributes.find((attr) => attr.Name === name)?.Value || ""
    );
  };

  // Handle Profile Update Submission
  const onFinish = async (values: any) => {
    try {
      await profileService.updateProfile({
        email: values.email,
        family_name: values.family_name,
        given_name: values.given_name,
        address: values.address,
        gender: values.gender,
        birthdate: values.birthdate.format("YYYY-MM-DD"),
        country: values.country,
      });
      message.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  return (
    <MainLayout>
      <h2 style={{ marginBottom: "16px" }}>Profile</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24}>
          <Card>
            <>
              {loading ? (
                <Spin
                  size="large"
                  style={{ display: "block", margin: "100px auto" }}
                />
              ) : (
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
                    <Tag color="blue">
                      {getAttributeValue("custom:userType")}
                    </Tag>
                  </div>

                  <Divider />

                  {/* Editable Form */}
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    disabled={!editing} // Disable form when not editing
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            {
                              type: "email",
                              message: "Please enter a valid email!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="address" label="Address">
                          <Input
                            prefix={<HomeOutlined />}
                            placeholder="Address"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="family_name" label="Family Name">
                          <Input placeholder="Family Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="given_name" label="Given Name">
                          <Input placeholder="Given Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="gender" label="Gender">
                          <Select placeholder="Select Gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="birthdate" label="Birthdate">
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="country" label="Country">
                          <Input
                            prefix={<EnvironmentOutlined />}
                            placeholder="Country"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Buttons to Edit or Save */}
                    <Row justify="end" gutter={16}>
                      {editing ? (
                        <>
                          <Col>
                            <Button
                              type="default"
                              onClick={() => setEditing(false)}
                            >
                              Cancel
                            </Button>
                          </Col>
                          <Col>
                            <Button type="primary" htmlType="submit">
                              Save Changes
                            </Button>
                          </Col>
                        </>
                      ) : (
                        <Col>
                          <Button
                            type="primary"
                            onClick={() => setEditing(true)}
                          >
                            Edit Profile
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Form>
                </Card>
              )}
            </>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default UpdateProfileView;
