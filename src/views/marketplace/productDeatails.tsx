import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../service/productService";
import {
  Spin,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Divider,
  Avatar,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import MainLayout from "../../component/MainLayout";
import { UserOutlined } from "@ant-design/icons";
import { amenityService } from "../../service/amenityService";

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productowner, setProductowner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amenities, setAmenities] = useState<any[]>([]);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSendMessage = async (values: { message: any }) => {
    if (!productowner?.email) {
      message.error("Owner email not found.");
      return;
    }

    const requestData = {
      message: values.message,
      recipient_email: productowner.email,
      product_id: product.id,
    };

    try {
      await productService.contactOwner(requestData);
      message.success("Message sent successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    fetchAmenities();
    const fetchProductDetails = async () => {
      try {
        const response = await productService.getProductDetails(Number(id));

        setProduct(response.data.product);
        setProductowner(response.data.product_owner_information);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const openModal = (src) => {
    setCurrentImage(src);
    setIsModalOpen(true);
  };

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const response = await amenityService.getAmenities();
      console.log(response.data.amenities);
      setAmenities(response.data.amenities); // ✅ Stores fetched amenities
    } catch (error) {
      message.error("Failed to fetch amenities");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Title level={3}>Product Not Found</Title>
        <Text>The product you are looking for does not exist.</Text>
      </MainLayout>
    );
  }

  // Get image URLs from API response
  const imageUrls = product.image_urls || [];

  // Ensure at least one image is available for the main image
  const mainImage =
    imageUrls.length > 0 ? imageUrls[0] : "https://via.placeholder.com/800x500";

  // Use remaining images for the smaller cards
  const smallImages = imageUrls.slice(1, 5); // Max 4 small images

  return (
    <MainLayout>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <h2 style={{ marginBottom: "16px", fontSize: 20 }}>🏡 Marketplace</h2>
        </Col>
      </Row>

      <Row gutter={[0, 16]}>
        {/* Large Main Image Card */}
        <Col xs={24} sm={12} md={16}>
          <Card bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24}>
                <Card bordered={false}>
                  <Row gutter={[16, 16]}>
                    {smallImages.length > 0 ? (
                      smallImages.map((image, index) => (
                        <Col key={index} xs={24} sm={24} md={24}>
                          <Card
                            bordered={false}
                            onClick={() => openModal(image)}
                            style={{
                              backgroundImage: image ? `url(${image})` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundColor: image ? "transparent" : "#ccc", // Fallback background color
                              height: 250,
                              borderRadius: "12px",
                              color: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {!image && (
                              <h2 style={{ padding: "20px", color: "#555" }}>
                                🏡 No Image
                              </h2>
                            )}
                            {image && (
                              <h2 style={{ padding: "20px" }}>
                                🏡 {product.name}
                              </h2>
                            )}
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs={24}>
                        <Card
                          bordered={false}
                          style={{
                            backgroundColor: "#ccc", // Fallback background color
                            height: 250,
                            borderRadius: "12px",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <h2 style={{ padding: "20px", color: "#555" }}>
                            🏡 No Images Available
                          </h2>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Small Image Cards */}
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Row gutter={[16, 16]}>
              {smallImages.length > 0 ? (
                smallImages.map((image, index) => (
                  <Col key={index} xs={24} sm={24} md={12}>
                    <Card
                      bordered={false}
                      onClick={() => openModal(image)}
                      style={{
                        backgroundImage: image ? `url(${image})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: image ? "transparent" : "#ccc", // Fallback background color
                        height: 250,
                        borderRadius: "12px",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!image && (
                        <h2 style={{ padding: "20px", color: "#555" }}>
                          🏡 No Image
                        </h2>
                      )}
                      {image && (
                        <h2 style={{ padding: "20px" }}>🏡 {product.name}</h2>
                      )}
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={24}>
                  <Card
                    bordered={false}
                    style={{
                      backgroundColor: "#ccc", // Fallback background color
                      height: 250,
                      borderRadius: "12px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h2 style={{ padding: "20px", color: "#555" }}>
                      🏡 No Images Available
                    </h2>
                  </Card>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal open={isModalOpen} footer={null} onCancel={closeModal}>
        <img
          src={currentImage}
          alt="Preview"
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </Modal>

      <Row gutter={[0, 16]}>
        <Col xs={24} sm={12} md={24}>
          <Card bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={16}>
                <Card bordered={false} style={{ minHeight: 520 }}>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <h2 className="mb-6">
                    {product.country} {product.city}
                  </h2>
                  <hr className="mb-10" />
                  <h1 className="text-2xl font-semibold mb-2">
                    Desired Amenities
                  </h1>
                  <Row gutter={[16, 16]}>
                    {product.desired_amenities.length > 0 ? (
                      product.desired_amenities.map((amenityId) => {
                        // Find matching amenity from fetched list
                        const matchedAmenity = amenities.find(
                          (a) => a.id === amenityId
                        );

                        // If no match found, skip rendering
                        if (!matchedAmenity) return null;

                        return (
                          <Col key={matchedAmenity.id} xs={24} sm={12} md={3}>
                            <Card bordered className="text-center">
                              <img
                                src={matchedAmenity.image_url}
                                alt={matchedAmenity.name}
                                style={{
                                  height: "30px",
                                  display: "inline",
                                }}
                              />
                              <h3 style={{ margin: 0 }}>
                                {matchedAmenity.name}
                              </h3>
                            </Card>
                          </Col>
                        );
                      })
                    ) : (
                      <Col xs={24}>
                        <p style={{ color: "#888" }}>No amenities available</p>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col xs={24} sm={24} md={24} className="mt-7">
                      <hr className="mb-7" />
                      <h1 className="text-2xl font-semibold mb-6">
                        About the resort
                      </h1>
                      <p className="text-lg leading-loose">
                        {product.description}
                      </p>
                      <h1 className="text-2xl font-semibold mb-7"></h1>

                      <hr className="mb-7" />
                      <h1 className="text-2xl font-semibold mb-6">Financial</h1>
                      <ul className="text-lg leading-loose category-sub">
                        <li>
                          <span className="font-semibold list3">
                            Full amount necessary:
                          </span>{" "}
                          {product.price} €
                        </li>
                        <li>
                          <span className="font-semibold list3">
                            Currently collected:
                          </span>
                          {product.collected_amount} €
                        </li>
                        <li>
                          <span className="font-semibold list3">
                            Still to be contributed:
                          </span>
                          {product.price - product.collected_amount} €
                        </li>
                      </ul>
                    </Col>
                  </Row>
                  <hr className="mb-10 mt-10" />

                  <h1 className="text-2xl font-semibold mb-8">
                    Investor Requirements
                  </h1>

                  <ul className="amen category-sub">
                    {product.requirements_investors?.length > 0 ? (
                      product.requirements_investors.map((aspect, index) => (
                        <li key={index}>{aspect}</li>
                      ))
                    ) : (
                      <li>No requirements_investors available</li>
                    )}
                  </ul>

                  <hr className="mb-10 mt-10" />

                  <h1 className="text-2xl font-semibold mb-8">
                    Environment around the area
                  </h1>

                  <Row>
                    {/* Financial Aspects */}
                    <Col xs={24} sm={8} md={12}>
                      <h1 className="text-2xl font-semibold mb-2">
                        Financial Aspects
                      </h1>
                      <ul className="amen category-sub">
                        {product.financial_aspects?.length > 0 ? (
                          product.financial_aspects.map((aspect, index) => (
                            <li key={index}>{aspect}</li>
                          ))
                        ) : (
                          <li>No financial aspects available</li>
                        )}
                      </ul>
                    </Col>

                    {/* Environment Area */}
                    <Col xs={24} sm={8} md={12}>
                      <h1 className="text-2xl font-semibold mb-2">
                        Environment Area
                      </h1>
                      <ul className="amen category-sub">
                        {product.enviroment_area?.length > 0 ? (
                          product.enviroment_area.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))
                        ) : (
                          <li>No environment details available</li>
                        )}
                      </ul>
                    </Col>
                  </Row>

                  <Row className="mt-10">
                    {/* Special Attractions */}
                    <Col xs={24} sm={8} md={12}>
                      <h1 className="text-2xl font-semibold mb-2">
                        Special Attractions
                      </h1>
                      <ul className="amen category-sub">
                        {product.special_attractions?.length > 0 ? (
                          product.special_attractions.map(
                            (attraction, index) => (
                              <li key={index}>{attraction}</li>
                            )
                          )
                        ) : (
                          <li>No special attractions available</li>
                        )}
                      </ul>
                    </Col>

                    {/* Public Transportation */}
                    <Col xs={24} sm={8} md={12}>
                      <h1 className="text-2xl font-semibold mb-2">
                        Public Transportation
                      </h1>
                      <ul className="amen category-sub">
                        {product.public_transportation?.length > 0 ? (
                          product.public_transportation.map(
                            (transport, index) => (
                              <li key={index}>{transport}</li>
                            )
                          )
                        ) : (
                          <li>No public transportation available</li>
                        )}
                      </ul>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8}>
                {productowner && (
                  <Card
                    style={{
                      borderRadius: "12px",
                      padding: "20px",
                      backgroundColor: "#fafafa",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Header with Avatar and Owner Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Avatar
                        size={64}
                        src="https://i.pravatar.cc/150?img=3"
                        icon={<UserOutlined />}
                      />
                      <div style={{ marginLeft: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>
                          {productowner.first_name} {productowner.last_name}
                        </Title>
                      </div>
                    </div>

                    <Divider />

                    <div className="lin1">
                      <Text strong>Required investment:</Text>
                      <Text style={{ float: "right" }}>
                        {product.price - product.collected_amount} €
                      </Text>

                      <br />

                      <Text strong>Location of resort:</Text>
                      <Text style={{ float: "right" }}>{product.city}</Text>

                      <br />

                      {/* <Text strong>Email Address:</Text>
                      <Text style={{ float: "right" }}>
                        {productowner.email}
                      </Text> */}
                      <Text strong>Land of resort:</Text>
                      <Text style={{ float: "right" }}>{product.country}</Text>

                      <br></br>
                      <Text strong>Amount of guests:</Text>
                      <Text style={{ float: "right" }}>
                        {product.max_persons}
                      </Text>
                      <br></br>
                      <Text strong>Location type:</Text>
                      <Text style={{ float: "right" }}>
                        {product.location_type}
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      block
                      size="large"
                      style={{
                        marginTop: 20,
                        minHeight: 40,
                      }}
                      onClick={showModal}
                    >
                      Contact owner
                    </Button>

                    <Modal
                      title="Send a message to owner"
                      open={isModalVisible}
                      onCancel={() => setIsModalVisible(false)}
                      footer={null}
                    >
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSendMessage}
                      >
                        <Form.Item
                          name="message"
                          label="Your Message"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your message",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Type your message here..."
                          />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block>
                          Send Message
                        </Button>
                      </Form>
                    </Modal>
                  </Card>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default ProductDetails;
