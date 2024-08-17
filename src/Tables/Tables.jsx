import { SearchOutlined } from '@ant-design/icons';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Col, Form, Input, InputNumber, Popconfirm, Row, Table, Typography } from 'antd';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { firebaseDb } from "../firabase";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Chip } from '@mui/material';

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
    <td {...restProps} style={{ padding: '8px' }}>
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
  const [originalData, setOriginalData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  
  const yearNames = [
    { id: '1', name: '2022' },
    { id: '2', name: '2023' },
    { id: '3', name: '2024' },
  ];
  const monthNames = [
    { id: '1', name: 'Jan' },
    { id: '2', name: 'Feb' },
    { id: '3', name: 'Mar' },
    { id: '4', name: 'Apr' },
    { id: '5', name: 'May' },
    { id: '6', name: 'Jun' },
    { id: '7', name: 'Jul' },
    { id: '8', name: 'Aug' },
    { id: '9', name: 'Sep' },
    { id: '10', name: 'Oct' },
    { id: '11', name: 'Nov' },
    { id: '12', name: 'Dec' },
  ];
  const weekNames = [
    { id: '1', name: 'Week1' },
    { id: '2', name: 'Week2' },
    { id: '3', name: 'Week3' },
    { id: '4', name: 'Week4' }
  ];

  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([]);
  const [week, setWeek] = useState([]);
  const [search, setSearch] = useState('');

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
        setOriginalData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setWeekData(newData);
        setOriginalData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const timestampToDate = (timestamp) => {
    return timestamp ? new Date(timestamp.seconds * 1000) : null;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'id',
      key: 'date',
      render: (id) => new Date(id.split('T')[0]).toLocaleDateString(),
      editable: true,
      sorter: (a, b) => new Date(a.id) - new Date(b.id),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      editable: true,
      sorter: (a, b) => a.invoice_number - b.invoice_number,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (date) => timestampToDate(date)?.toLocaleDateString() || 'N/A',
      editable: true,
      sorter: (a, b) => new Date(a.invoice_date) - new Date(b.invoice_date),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      render: (date) => timestampToDate(date)?.toLocaleDateString() || 'N/A',
      editable: true,
      sorter: (a, b) => new Date(a.delivery_date) - new Date(b.delivery_date),
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
                color: '#1890ff',
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a style={{ color: '#ff4d4f' }}>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
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
      render: () => <Typography.Link style={{ color: '#52c41a' }}>Pay Now</Typography.Link>,
    },
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
        console.log(`Fetching data from: ${weekPath}`);
        const weekRef = collection(firebaseDb, weekPath);
        const querySnapshot = await getDocs(weekRef);
        const weekData = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Initial week data:', weekData);
        setWeekData(weekData);
        setOriginalData(weekData);
      } catch (error) {
        console.error("Error fetching initial week data:", error);
      }
    };
    const fetchVendors = async () => {
      const uid = window.sessionStorage.getItem('userId');
      if (!uid) {
        console.log('No user ID found');
        return;
      }

      try {
        const vendorRef = collection(firebaseDb, `restaurants/${uid}/Vendors`);
        const querySnapshot = await getDocs(vendorRef);
        const vendorData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVendors(vendorData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchCurrentWeekData();
    fetchVendors();
  }, []);

  const handleVendorChange = (event) => {
    setSelectedVendors(event.target.value);
  };

  const filterData = (event) => {
    const { value } = event.target;
    const filteredData = originalData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setWeekData(filteredData);
    console.log(filterData);
    setSearch(value);
  };

  const handleYearChange = (event) => {
    const { value } = event.target;
    const isAllSelected = value[value.length - 1] === "all";
    const newYear = isAllSelected ? yearNames.map(n => n.name) : value.filter(v => v !== "all");
    setYear(newYear);
    setMonth([]);  // Reset month if year changes
    setWeek([]);   // Reset week if year changes
  };

  const handleMonthChange = (event) => {
    const { value } = event.target;
    setMonth(value);
  };
  

  const handleWeekChange = (event) => {
    const { value } = event.target;
    setWeek(value);
  };
  

  const handleSearch = async () => {
    const uid = window.sessionStorage.getItem('userId');
    if (!uid) {
      console.log('No user ID found');
      return;
    }
    if (!search && year.length === 0 && month.length === 0 && week.length === 0) {
      console.log('No search criteria provided');
      return;
    }
    try {
      let weekPath = `restaurants/${uid}`;
      if (Array.isArray(year) && year.length > 0) {
        weekPath += `/${year[0]}`;
      }
      if (Array.isArray(month) && month.length > 0) {
        weekPath += `/${month[0]}`;
      }
      const weeksToSearch = Array.isArray(week) && week.length > 0 ? week : ["Week1", "Week2", "Week3", "Week4"];
      const results = [];
      for (const wk of weeksToSearch) {
        const fullPath = `${weekPath}/${wk}`;
        console.log(`Searching data in path: ${fullPath}`);
        const weekRef = collection(firebaseDb, fullPath);
        let querySnapshot;
        if (search) {
          const searchQuery = query(weekRef, where('name', '>=', search), where('name', '<=', search + '\uf8ff'));
          querySnapshot = await getDocs(searchQuery);
        } else {
          querySnapshot = await getDocs(weekRef);
        }
        const weekData = querySnapshot.docs.map(doc => ({
          key: doc.id,
          id: doc.id,
          ...doc.data()
        }));
        results.push(...weekData);
      }
      console.log('Searched week data:', results);
      setWeekData(results);
    } catch (error) {
      console.error("Error searching week data:", error);
    }
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <Row gutter={16} style={{ marginBottom: '16px', marginLeft: '85%' }}>
        <Col span={24}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/CustomTable')}
            style={{ marginBottom: '16px' }}
          >
            Add New Receipt
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
      <Col span={4}>
        <Form.Item>
          <InputLabel>Vendor</InputLabel>
          <Select
            labelId="vendor-select-label"
            id="vendor-select"
            multiple
            value={selectedVendors}
            onChange={handleVendorChange}
            input={<OutlinedInput label="Vendor" />}
            renderValue={(selected) => selected.join(', ')}
            fullWidth
          >
            {vendors.map((vendor) => (
              <MenuItem key={vendor.id} value={vendor.name}>
                <Checkbox checked={selectedVendors.includes(vendor.name)} />
                <ListItemText primary={vendor.name} />
              </MenuItem>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item>
          <InputLabel>Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            multiple
            value={year}
            onChange={handleYearChange}
            input={<OutlinedInput label="Year" />}
            renderValue={(selected) => selected.join(', ')}
            fullWidth
          >
            {yearNames.map((yearOption) => (
              <MenuItem key={yearOption.id} value={yearOption.name}>
                <Checkbox checked={year.includes(yearOption.name)} />
                <ListItemText primary={yearOption.name} />
              </MenuItem>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item>
          <InputLabel>Months</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            multiple
            value={month}
            onChange={handleMonthChange}
            input={<OutlinedInput label="Month" />}
            renderValue={(selected) => selected.join(', ')}
            fullWidth
          >
            {monthNames.map((monthOption) => (
              <MenuItem key={monthOption.id} value={monthOption.name}>
                <Checkbox checked={month.includes(monthOption.name)} />
                <ListItemText primary={monthOption.name} />
              </MenuItem>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        {year.length > 0 && month.length > 0 && (
          <Form.Item>
            <InputLabel>Week</InputLabel>
            <Select
              labelId="week-select-label"
              id="week-select"
              multiple
              value={week}
              onChange={handleWeekChange}
              input={<OutlinedInput label="Week" />}
              renderValue={(selected) => selected.join(', ')}
              fullWidth
            >
              {weekNames.map((weekOption) => (
                <MenuItem key={weekOption.id} value={weekOption.name}>
                  <Checkbox checked={week.includes(weekOption.name)} />
                  <ListItemText primary={weekOption.name} />
                </MenuItem>
              ))}
            </Select>
          </Form.Item>
        )}
      </Col>
      <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <Button
    variant="contained"
    color="primary"
    onClick={handleSearch}
    endIcon={<SearchIcon />}
    fullWidth
  >
    Search
  </Button>
</Col>
    </Row>

<Row gutter={16} style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
  
</Row>

      <Form form={form} component={false} style={{ marginTop: '16px' }}>
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
          style={{ marginTop: '16px' }}
        />
      </Form>
    </div>
  );
};

export default Tables;
