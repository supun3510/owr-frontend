import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Col,
  Row,
  Radio,
  DatePicker,
  Select,
} from "antd";
import { signup } from "./../../service/authService";
import bgImg from "./../../assets/img/bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import countries from "world-countries";
import axios, { AxiosError } from "axios";

const { Title } = Typography;

const { Option } = Select;

const countryList = countries.map((country) => ({
  code: country.cca2,
  name: country.name.common,
  flagUrl: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
}));

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  interface SignupFormValues {
    username: string;
    password: string;
    email: string;
    gender: string;
    yourname: string;
    familyname: string;
    address: string;
    birthdate: string;
    country: string;
    usertype: string;
  }

  const onFinish = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const userData = {
        username: values.username,
        password: values.password,
        email: values.email,
        gender: values.gender,
        givenName: values.yourname,
        familyName: values.familyname,
        address: values.address,
        birthdate: values.birthdate
          ? dayjs(values.birthdate).format("YYYY-MM-DD")
          : "",
        country: values.country,
        userType: values.usertype,
      };

      const response = await signup(userData);
      message.success(`Signup successful: ${response.message}`);
      navigate("/login");
    } catch (error: unknown) {
      console.error("Signup Error:", error);

      if (error instanceof Error) {
        const axiosError = error as AxiosError<{ error: string }>;
        const errorMessage =
          axiosError.response?.data?.error || "User already exists";

        message.error(errorMessage);
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="w-full h-full bg-white flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="w-[800px] bg-white/100 rounded-md shadow-md p-12">
        <Title level={2} className="text-center">
          Signup
        </Title>
        <Form name="signup" onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input your email!" },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  { required: true, message: "Please select your gender" },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Your Name"
                name="yourname"
                rules={[{ required: true, message: "Please input your name" }]}
              >
                <Input placeholder="Your Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Family Name"
                name="familyname"
                rules={[
                  { required: true, message: "Please input family name" },
                ]}
              >
                <Input placeholder="Family Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please input address" }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Birth Date"
                name="birthdate"
                rules={[{ required: true, message: "Please select birthdate" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Birthdate"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="User Type"
                name="usertype"
                rules={[
                  { required: true, message: "Please select a user type!" },
                ]}
              >
                <Select placeholder="Select User Type">
                  <Option value="INVESTOR">Investor</Option>
                  <Option value="LANDOWNER">Landowner</Option>
                  <Option value="SCOUT">Scout</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Please select country!" }]}
              >
                <Select
                  placeholder="Select your country"
                  showSearch
                  optionFilterProp="children"
                >
                  {countryList.map((country) => (
                    <Option key={country.code} value={country.name}>
                      <img
                        src={country.flagUrl}
                        alt={country.name}
                        width={20}
                        height={15}
                        style={{ marginRight: 8 }}
                      />
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                  {
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/,
                    message:
                      "Password must contain uppercase, lowercase, number, and special character!",
                  },
                ]}
                hasFeedback // Enables real-time validation feedback
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {" "}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mt-6"
                  block
                  loading={loading}
                >
                  Signup
                </Button>
              </Form.Item>
            </Col>
            <Col span={12} className="mt-9 text-right">
              {" "}
              <div className="newuser text-sm">
                have account?{" "}
                <Link to="/login" className="text-[blue]">
                  Login Now!
                </Link>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
