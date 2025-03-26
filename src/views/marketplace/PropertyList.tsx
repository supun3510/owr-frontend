import {
  Row,
  Col,
  Card,
  Button,
  List,
  Typography,
  Carousel,
  Slider,
  Spin,
  Select,
  Input,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import MainLayout from "../../component/MainLayout";
import React, { useEffect, useState } from "react";
import { productService } from "../../service/productService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const PropertyList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [SearchLocation, setSearchLocation] = useState<string>("");

  const [isLandowner, setIsLandowner] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setIsLandowner(userType === "LANDOWNER");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async (min: number, max: number) => {
    setLoading(true);
    try {
      const response = await productService.filterByPrice(min, max);
      setProducts(response.data.product || []);
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSortedProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductsSortedByPrice();
      console.log(response);
      setProducts(response.data.product || []);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSortedMaxProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductsSortedBymaxPrice2();
      console.log(response);
      setProducts(response.data.product || []);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredByAmenities = async (value: string) => {
    setLoading(true);
    try {
      const response = await productService.filterByAmenities(value);
      //  console.log(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error filtering products by amenities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    if (value === "price-asc") {
      fetchSortedProducts();
    } else if (value === "price-desc") {
      fetchSortedMaxProducts();
    } else {
      fetchProducts();
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value || value === "") {
      alert("ggkgkg");
      setProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
    );

    setProducts(filtered);
  };

  const handleSearchLocation = (value: string) => {
    console.log(value);
    setSearchLocation(value);

    const filtered = products.filter((product) =>
      (product.location_type ?? "").toLowerCase().includes(value.toLowerCase())
    );

    setProducts(filtered);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    location.reload();
    // setSearchTerm("");
    // setPriceRange([0, 10000]);
    // setAmenity("");
    // fetchProducts();
  };

  return (
    <MainLayout>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <h2 style={{ marginBottom: "16px", fontSize: 20 }}>🏡 Marketplace</h2>
        </Col>
        <Col xs={24} sm={12} md={12} className="text-right">
          {isLandowner && (
            <Button
              type="primary"
              onClick={() => navigate("/addmarketplace")}
              className="mb-4"
              style={{ minHeight: 40 }}
            >
              Add New Marketplace
            </Button>
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
          {/* Price Filter */}
          <Card bordered>
            <Title level={5}>Filter by Price</Title>
            <Slider
              range
              value={priceRange}
              min={0}
              max={100000}
              onChange={(value) => setPriceRange(value as [number, number])}
              onAfterChange={(value) =>
                fetchFilteredProducts(value[0], value[1])
              }
              tooltip={{ open: true }}
            />
          </Card>

          {/* Search Filter */}
          <Card bordered style={{ marginTop: 16 }}>
            <Title level={5}>Search Properties</Title>
            <Input
              placeholder="Search by name or description..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)} // 🔹 Real-time filtering
              style={{ width: "100%" }}
            />
          </Card>

          <Card bordered style={{ marginTop: 16 }}>
            <Title level={5}>Filter by Amenities</Title>
            <Input
              placeholder="Enter amenity name..."
              onChange={(e) => fetchFilteredByAmenities(e.target.value)}
            />
          </Card>

          {/* Sorting Dropdown */}
          <Card bordered style={{ marginTop: 16 }}>
            <Title level={5}>Sort By</Title>
            <Select
              value={sortOrder}
              style={{ width: "100%" }}
              onChange={handleSortChange}
            >
              <Option value="">Default</Option>
              <Option value="price-desc">Price (High to low)</Option>
              <Option value="price-asc">Price (Low to High)</Option>
            </Select>
          </Card>

          <Card bordered style={{ marginTop: 16 }}>
            <Title level={5}>Type of location</Title>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a Location type"
              onChange={handleSearchLocation}
            >
              <Option value="Urban">Urban</Option>
              <Option value="Coastal">Coastal</Option>
              <Option value="Rural">Rural</Option>
            </Select>
          </Card>

          {/* Reset Filters Button */}
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={resetFilters}
            style={{ marginTop: 16, width: "100%" }}
          >
            Reset Filters
          </Button>
        </Col>

        <Col xs={24} sm={24} md={18}>
          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={products}
              renderItem={(product) => {
                const imageUrls = product.image_urls?.length
                  ? product.image_urls
                  : ["https://via.placeholder.com/300"];

                return (
                  <Card style={{ marginBottom: "20px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div style={{ width: "30%" }} className="gallery">
                        <Carousel autoplay>
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px 0 0 8px",
                              }}
                            />
                          ))}
                        </Carousel>
                      </div>

                      <div style={{ flex: 1, padding: "16px" }}>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={12}>
                            {" "}
                            <Title level={2} className="text-sm">
                              {product.name}
                            </Title>
                          </Col>
                          <Col xs={24} sm={24} md={10} className="text-right">
                            <span className="text-sm font-semibold">
                              For {product.min_persons} - {product.max_persons}{" "}
                              persons
                            </span>{" "}
                            <br />
                            <span className="text-sm font-semibold">
                              Required investment:{" "}
                              {product.price - product.collected_amount} €
                            </span>
                            <br />
                            <span className="text-xl font-semibold">
                              ${product.price} €
                            </span>
                          </Col>
                        </Row>

                        <p
                          style={{
                            marginTop: "-30",
                            marginBottom: 20,
                            color: "#555",
                          }}
                        >
                          <strong>Location : </strong>
                          {product.city}, {product.country}
                        </p>
                        <p
                          style={{
                            marginTop: "8px",
                            color: "#555",
                            minHeight: 78,
                          }}
                        >
                          {product.description.length > 350
                            ? product.description.slice(0, 350) + "..."
                            : product.description}
                        </p>

                        <Row className="mt-7">
                          <Col
                            xs={24}
                            sm={12}
                            md={12}
                            className="text-left"
                          ></Col>
                          <Col xs={24} sm={12} md={12} className="text-right">
                            {/* For ${product.min_persons} - {product.max_persons}{" "}
                            persons
                            <br /> */}

                            {isLandowner && (
                              <Popconfirm
                                title="Are you sure you want to delete this amenity?"
                                onConfirm={() => handleDelete(product.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  type="default"
                                  style={{ marginTop: "8px", minHeight: 40 }}
                                  className="mr-5"
                                  icon={<DeleteOutlined />}
                                  danger
                                >
                                  Delete
                                </Button>
                              </Popconfirm>
                            )}

                            <Button
                              type="primary"
                              style={{ marginTop: "8px", minHeight: 40 }}
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              See details →
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                );
              }}
            />
          )}
        </Col>
      </Row>
    </MainLayout>
  );
};

export default PropertyList;
