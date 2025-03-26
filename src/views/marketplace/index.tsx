import React from "react";
import { Row, Col, Card } from "antd";
import MainLayout from "../../component/MainLayout";
import AddPropertyForm from "./addPropertyForm";

const Marketplace: React.FC = () => {
  return (
    <MainLayout>
      <h2 style={{ marginBottom: "16px" }}>🏡 Marketplace</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24}>
          <Card>
            <AddPropertyForm />
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Marketplace;
