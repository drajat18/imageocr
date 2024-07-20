import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import { Col, Row, Button, Table, Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import { collection, getDocs } from "firebase/firestore"; 
import { firebaseDb } from "../firabase";
import CustomTable from '../CustomTable';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Tables = () => {
  const [form] = Form.useForm();
  const [weekData, setWeekData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const navigate = useNavigate();

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: '',
      name: '',
      invoice_number: '',
      invoice_date: '',
      delivery_date: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...weekData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setWeekData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setWeekData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  // Define columns based on your data structure
  const columns = [
    {
      title: 'Date',
      dataIndex: 'id',
      key: 'date',
      render: (id) => new Date(id.split('T')[0]).toLocaleDateString(),
      editable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      editable: true,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (date) => date.toDate().toLocaleDateString(),
      editable: true,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      render: (date) => date.toDate().toLocaleDateString(),
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={navigateCustomTable}>
            Edit
          </Typography.Link>
        );
      },
    },

    {
      title: 'Payment',
      dataIndex: '',
      key: '',
      editable: true,

      render: () => <Typography.Link>Pay Now</Typography.Link>,    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'invoice_number' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchCurrentWeekData = async () => {
      const uid = window.sessionStorage.getItem('userId');
      if (!uid) {
        console.log('No user ID found');
        return;
      }
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[currentDate.getMonth()];
        const weekNumber = Math.ceil(currentDate.getDate() / 7);
        const weekKey = `Week${weekNumber}`;

        const weekPath = `restaurants/${uid}/${year}/${month}/${weekKey}`;
        const weekRef = collection(firebaseDb, weekPath);

        const querySnapshot = await getDocs(weekRef);

        const weekData = querySnapshot.docs.map(doc => ({
          key: doc.id, // Ant Design Table requires a unique 'key' for each row
          id: doc.id,
          ...doc.data()
        }));

        console.log('Current week data:', weekData);
        setWeekData(weekData);

      } catch (error) {
        console.error("Error fetching current week data:", error);
      }
    };

    fetchCurrentWeekData();
  }, []);

  const navigateCustomTable = (e) => {
    let id = e.target.parentElement.parentElement.dataset['rowKey'];
    let selectedData = weekData.filter(item =>item.id ===id )[0].data
    let selectedColumn = weekData.filter(item =>item.id ===id )[0].selectedColumn
    let totalAmount = weekData.filter(item =>item.id ===id )[0].totalAmount
    
    navigate('/CustomTable', { state: { selectedData,selectedColumn ,totalAmount} });
    //navigate('/CustomTable');
  };
  const handleclick = () => {
    navigate('/customtable');
  };

  return (
    <div>
      <Row justify="center" style={{ height: '5rem' }}>
        <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Welcome to Tables</h1>
        </Col>
      </Row>

      <Row justify="end" style={{ marginBottom: '20px' }}>
        <Col>
          <Button  type="primary" icon={<SearchOutlined />}  onClick={handleclick}>
            Add New Receipt
          </Button>
         
        </Col>
      </Row>

      <Row justify="center">
        <Col span={20}>
          <Form form={form} component={false}>
            <Table 
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={weekData} 
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
              loading={weekData.length === 0}
            />
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Tables;
