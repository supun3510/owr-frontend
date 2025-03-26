import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  InputNumber,
  message,
  Col,
  Row,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { productService } from "../../service/productService";
import { amenityService } from "../../service/amenityService";
//import { productService } from "../../service/productService";
import { useNavigate } from "react-router-dom";

import countries from "world-countries";

const countryList = countries.map((country) => ({
  code: country.cca2,
  name: country.name.common,
  flagUrl: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
}));

const { TextArea } = Input;
const { Option } = Select;

const AddPropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [amenities, setAmenities] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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

    fetchAmenities();
  }, []);

  // Handle File Upload Change
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };
  const handleFinish = async (values: any) => {
    const formData = new FormData();

    // Append Files
    fileList.forEach((file: any) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    // Append Other Fields
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // Convert arrays to JSON
      } else if (typeof value === "number") {
        formData.append(key, value.toString()); // Convert numbers to strings
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await productService.addProduct(formData);
      message.success("Property added successfully!");
      navigate("/marketplace");
      console.log("Response:", response);
    } catch (error) {
      message.error("Failed to add product.");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleFinish}>
      {/* Upload Images */}
      <Form.Item
        name="files"
        label="Upload Images"
        rules={[{ required: true, message: "Please upload property images" }]}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false} // Ensures file isn't uploaded instantly
          multiple
        >
          {fileList.length >= 5 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      {/* Name */}
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input placeholder="Enter property name" />
      </Form.Item>

      {/* Description */}
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <TextArea rows={4} placeholder="Enter property description" />
      </Form.Item>

      {/* Type & Price */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select Type">
              <Option value="Per night">Per night</Option>
              <Option value="Per Day">Per Day</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="price"
            label="Investment Volume"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="Enter amount" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      {/* Collected Amount & Modules */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="collected_amount"
            label="Collected Amount"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Collected amount"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="amount_of_module"
            label="Amount of Modules"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Modules count"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Min & Max Persons */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="min_persons"
            label="Min Persons"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Minimum persons"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="max_persons"
            label="Max Persons"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Maximum persons"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Country & City */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select country" showSearch>
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

        <Col span={12}>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input placeholder="Enter city name" />
          </Form.Item>
        </Col>
      </Row>

      {/* Desired Amenities & Financial Aspects */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="desired_amenities"
            label="Desired Amenities"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" placeholder="Select amenities">
              {amenities.map((amenity) => (
                <Option key={amenity.id} value={amenity.id}>
                  {amenity.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="financial_aspects" label="Financial Aspects">
            <Select mode="tags" placeholder="Financial aspects">
              <Option value="Deposit Required">Deposit Required</Option>
              <Option value="Monthly Rent">Monthly Rent</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Environment & Attractions */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="enviroment_area" label="Environment Area">
            <Select mode="tags" placeholder="Select environment type">
              <Option value="Near Beach">Near Beach</Option>
              <Option value="City Center">City Center</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="special_attractions" label="Special Attractions">
            <Select mode="tags" placeholder="Select attractions">
              <Option value="Historical Sites">Historical Sites</Option>
              <Option value="Nightlife">Nightlife</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Public Transport & Other Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="public_transportation" label="Public Transportation">
            <Select mode="tags" placeholder="Transport options">
              <Option value="Bus Stop Nearby">Bus Stop Nearby</Option>
              <Option value="Metro Station Nearby">Metro Station Nearby</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="other_details" label="Other Details">
            <Select mode="tags" placeholder="Additional details">
              <Option value="Pet Friendly">Pet Friendly</Option>
              <Option value="Gym Access">Gym Access</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Location Type & Investors */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="location_type" label="Location Type">
            <Select placeholder="Select location type">
              <Option value="Urban">Urban</Option>
              <Option value="Coastal">Coastal</Option>
              <Option value="Rural">Rural</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="requirements_investors"
            label="Investor Requirements"
          >
            <Select mode="tags" placeholder="Investor requirements"></Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Property
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPropertyForm;
