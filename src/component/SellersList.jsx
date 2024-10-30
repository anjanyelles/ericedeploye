import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Modal, Form, Input, Button } from 'antd';
import axios from 'axios';
import AdminPanelLayout from './AdminPanelLayout';

const SellerList = () => {
  const [sellerData, setSellerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get('http://182.18.139.138:8282/api/erice-service/user/sellerDetails', {
          headers: {
            accept: '*/*',
          },
        });
        setSellerData(response.data);
      } catch (error) {
        message.error('Failed to fetch seller details');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, []);

  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingSeller(null);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.patch('http://182.18.139.138:8282/api/erice-service/user/saveSellerDetails', {
        ...values,
        id: editingSeller.userId, // Assuming userId is the identifier for PATCH
      }, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      });
      message.success('Seller details updated successfully');
      // Update the sellerData with the new values
      setSellerData((prevData) => 
        prevData.map((seller) => (seller.userId === editingSeller.userId ? { ...seller, ...values } : seller))
      );
      handleModalClose();
    } catch (error) {
      message.error('Failed to update seller details');
    }
  };

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'sellerStoreName',
      key: 'sellerStoreName',
      align: 'center', // Center the text
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerName',
      align: 'center', // Center the text
    },
    {
      title: 'Mobile',
      dataIndex: 'sellerMobile',
      key: 'sellerMobile',
      align: 'center', // Center the text
    },
    {
      title: 'Email',
      dataIndex: 'sellerEmail',
      key: 'sellerEmail',
      align: 'center', // Center the text
    },
    {
      title: 'Address',
      dataIndex: 'sellerAddress',
      key: 'sellerAddress',
      align: 'center', // Center the text
    },
    {
      title: 'Latitude',
      dataIndex: 'sellerLat',
      key: 'sellerLat',
      align: 'center', // Center the text
    },
    {
      title: 'Longitude',
      dataIndex: 'sellerLng',
      key: 'sellerLng',
      align: 'center', // Center the text
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, seller) => (
        <Button type="primary" onClick={() => handleEdit(seller)}>
          Edit
        </Button>
      ),
      align: 'center', // Center the text
    },
  ];

  return (
    <AdminPanelLayout>
      <div style={{ padding: '20px' }}>
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <>
            <Table dataSource={sellerData} columns={columns} rowKey="userId" />
            <Modal
              title="Edit Seller Details"
              visible={isModalVisible}
              onCancel={handleModalClose}
              footer={null}
            >
              <Form
                initialValues={editingSeller}
                onFinish={handleUpdate}
              >
                <Form.Item
                  label="Store Name"
                  name="sellerStoreName"
                  rules={[{ required: true, message: 'Please input the store name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Seller Name"
                  name="sellerName"
                  rules={[{ required: false, message: 'Please input the seller name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Mobile"
                  name="sellerMobile"
                  rules={[{ required: false, message: 'Please input the mobile number!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="sellerEmail"
                  rules={[{ required: false, type: 'email', message: 'Please input a valid email!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Address"
                  name="sellerAddress"
                  rules={[{ required: false, message: 'Please input the address!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Latitude"
                  name="sellerLat"
                  rules={[{ required: false, message: 'Please input the latitude!' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  label="Longitude"
                  name="sellerLng"
                  rules={[{ required: false, message: 'Please input the longitude!' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Update</Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </AdminPanelLayout>
  );
};

export default SellerList;
