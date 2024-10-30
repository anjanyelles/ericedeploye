import React, { useState, useEffect } from 'react';
import { Input, Select, Image, Tag, Modal, Button, Upload, Form, Table, message } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import AdminPanelLayout from './AdminPanelLayout';


const { Search } = Input;
const { Option } = Select;

const SellerItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Fetch data from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8181/api/selleritems/list');
        setItems(response.data); // Assuming the API returns a list of items
      } catch (error) {
        message.error('Failed to fetch items from API');
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const showEditModal = (item) => {
    setSelectedItem(item);
    form.setFieldsValue({ ...item });
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    addForm.resetFields();
    setIsAddModalVisible(true);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      const updatedItems = items.map((item) =>
        item.key === selectedItem.key ? { ...item, ...values } : item
      );
      setItems(updatedItems);
      setIsEditModalVisible(false);
    });
  };

  const handleAddOk = () => {
    addForm.validateFields().then((values) => {
      const newItem = {
        key: items.length + 1,
        ...values,
        imageUrl: 'https://via.placeholder.com/100',
        status: 'Inactive',
      };
      setItems([...items, newItem]);
      setIsAddModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const columns = [
    { title: 'Sl.No', dataIndex: 'key', key: 'key' },
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Units', dataIndex: 'unit', key: 'unit' },
    { title: 'MRP', dataIndex: 'mrp', key: 'mrp' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => <Image width={50} src={imageUrl} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'blue' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => showEditModal(record)} className="bg-blue-500 text-white">
          <EditOutlined /> Edit
        </Button>
      ),
    },
  ];

  return (
    <>
    <AdminPanelLayout>
    <div className="flex flex-col h-screen">
      {/* Header */}
      

      <div className="flex flex-1">
        {/* Sidebar */}
     
        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Seller Items List</h2>
            <Button onClick={showAddModal} className="bg-green-500 text-white">
              Add New Item
            </Button>
          </div>

          <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center mb-4">
            <Select defaultValue="25" className="w-32">
              <Option value="25">25 entries</Option>
              <Option value="50">50 entries</Option>
              <Option value="100">100 entries</Option>
            </Select>
            <Search placeholder="Search" className="w-64" />
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <Table
              columns={columns}
              dataSource={items}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>

          {/* Add Item Modal */}
          <Modal
            title="Add New Item"
            visible={isAddModalVisible}
            onOk={handleAddOk}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleAddOk}>
                Add Item
              </Button>,
            ]}
          >
            <Form form={addForm} layout="vertical">
              <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="mrp" label="MRP" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form>
          </Modal>

          {/* Edit Item Modal */}
          <Modal
            title="Edit Item"
            visible={isEditModalVisible}
            onOk={handleEditOk}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleEditOk}>
                Update Item
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="mrp" label="MRP" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              {/* Display existing image */}
              <Form.Item label="Existing Image">
                <Image width={100} src={selectedItem?.imageUrl} />
              </Form.Item>

              {/* Upload new image */}
              <Form.Item label="Upload New Image">
                <Upload
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
    </AdminPanelLayout>
    </>
  );
};

export default SellerItemsList;
