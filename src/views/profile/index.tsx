import React from "react";
import { Row, Col, Card } from "antd";
import MainLayout from "../../component/MainLayout";
import ProfileView from "./profileview";

const Profile: React.FC = () => {
  return (
    <MainLayout>
      <h2 style={{ marginBottom: "16px" }}>Profile</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24}>
          <Card>
            <ProfileView />
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Profile;
