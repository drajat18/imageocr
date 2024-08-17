import React, { useState, useEffect } from 'react';
import { Table, Input, Button, DatePicker, Select, Popconfirm, Col, Row, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { firebaseDb } from '../src/firabase';  // Check your firebase import path
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomDropdown from './CutsomDropdown/CustomDropdown';

const { Option } = Select;

const CustomTable = () => {
 
  const [name, setName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [selectedRows, setSelectedRows] = useState([]);
  const [columnTotals, setColumnTotals] = useState({});
 
  const navigate = useNavigate();
  const location = useLocation();
  var data =[],value=0,column = '';
  if(location.state){
     data =location.state.selectedData;
    column = location.state.selectedColumn;
    value = location.state.totalAmount
  }
  const [totalAmount, setTotalAmount] = useState(value); //value
  const [dataForTable, setDataForTable] = useState(data);
  const [selectedColumn, setSelectedColumn] = useState(column); //column value
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('https://apiimageocr.ue.r.appspot.com/extract-data', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const extractedData = response.data.data;
      var test = extractedData.replace(/```json\n/, '').replace(/\n```/, '');
      const jsonData = JSON.parse(test);
      console.log(jsonData);
      setDataForTable(jsonData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("test")
    if (dataForTable) {
      try {
        const products = dataForTable.products_data || dataForTable.products || dataForTable.product_data;
        const other = dataForTable.invoice_details || dataForTable.customer_data || dataForTable.invoice_data || dataForTable.invoice;
        
        if (products) {
          setTableData(products);
          const headers = Object.keys(products[0]);
          setHeaders(headers);
        }
        
        if (other) {
          setName(other.name);
          setInvoiceNumber(other.invoice_number || other.invoice_no);
          setInvoiceDate(other.invoice_date || other.date ? moment(other.invoice_date || other.date).toDate() : null);
          setDeliveryDate(other.delivery_date ? moment(other.delivery_date).toDate() : null);
        }
      } catch (error) {
        console.error('Error processing data:', error);
      }
    }
  }, [dataForTable]);

  const handleDataChange = (rowIndex, columnName, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnName]: newValue
    };
    setTableData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {};
    headers.forEach(header => {
      newRow[header] = '';
    });
    setTableData([...tableData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = [...tableData];
    updatedData.splice(rowIndex, 1);
    setTableData(updatedData);
  };

  const handleAddHeader = () => {
    const newHeader = `Header ${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setTableData(tableData.map(row => ({...row, [newHeader]: ''})));
  };

  const handleDeleteColumn = (columnName) => {
    const updatedHeaders = headers.filter(header => header !== columnName);
    setHeaders(updatedHeaders);
    const updatedData = tableData.map(row => {
      const newRow = {...row};
      delete newRow[columnName];
      return newRow;
    });
    setTableData(updatedData);
  };

  const handleSave = async () => {
    if (name === '' || invoiceDate === null || deliveryDate === null || invoiceNumber === '') {
      alert("Please fill all the fields");
    } else {
        const convertToTimestamp = (dateValue) => {
            if (dateValue && typeof dateValue.toDate === 'function') {
                return Timestamp.fromDate(dateValue.toDate());
            } else if (dateValue instanceof Date) {
                return Timestamp.fromDate(dateValue);
            } else if (typeof dateValue === 'string') {
                return Timestamp.fromDate(new Date(dateValue));
            } else {
                return dateValue;
            }
        };

        const data = {
            name: name,
            invoice_number: invoiceNumber,
            invoice_date: convertToTimestamp(invoiceDate),
            delivery_date: convertToTimestamp(deliveryDate),
            data: dataForTable,
            totalAmount: totalAmount, // Include total amount in the data to be saved
            selectedColumn: selectedColumn,
        };

        try {
          const userId = sessionStorage.getItem('userId');
          if (!userId) {
            throw new Error("User ID not found in session storage");
          }
    
          const currentDate = new Date();
          const year = currentDate.getFullYear().toString();
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[currentDate.getMonth()];
          const weekNumber = Math.ceil(currentDate.getDate() / 7);
          const weekKey = `Week${weekNumber}`;
    
          const timestamp = Timestamp.now();
          const dateTimeString = timestamp.toDate().toISOString().replace(/[:.]/g, '-');
          const docPath = `restaurants/${userId}/${year}/${month}/${weekKey}/${name}_${dateTimeString}`;
    
          const docRef = doc(firebaseDb, docPath);
          await setDoc(docRef, { ...data, createdAt: timestamp });
    
          console.log("Data saved successfully!");
          navigate('/tables');
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
};

  const handleDelete = () => {
    setName('');
    setInvoiceNumber('');
    setInvoiceDate(null);
    setDeliveryDate(null);
    setHeaders([]);
    setTableData([]);
    window.location.href = 'https://www.google.com';
  };

  const handleRowSelection = (index) => {
    setSelectedRows(prevSelected => 
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const calculateColumnTotal = () => { 
    const total = tableData.reduce((sum, row) => {
      const value = parseFloat(row[selectedColumn]);
      return isNaN(value) ? sum : sum + value;
    }, 0);
    
    setTotalAmount(total.toFixed(2)); // Round to 2 decimal places
  };

  const ColumnSelector = () => (
    <Select
      style={{ width: 200, marginRight: 16 }}
      placeholder="Select column to calculate"
      onChange={(value) => setSelectedColumn(value)}
      value={selectedColumn}
    >
      {headers.map(header => (
        <Option key={header} value={header}>{header}</Option>
      ))}
    </Select>
  );

  const columns = headers.map((header) => ({
    title: header,
    dataIndex: header,
    key: header,
    editable: true,
    render: (text, record, rowIndex) => (
      <Input
        value={text}
        onChange={(e) => handleDataChange(rowIndex, header, e.target.value)}
      />
    ),
    footer: () => columnTotals[header] || '0.00'
  }));

  columns.push({
    title: 'Action',
    key: 'action',
    render: (_, record, index) => (
      <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(index)}>
        <Button icon={<DeleteOutlined />} />
      </Popconfirm>
    ),
  });

  const handleNameChange = (newName) => {
    setName(newName);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}
  
      <input
        type="file"
        onChange={handleFileChange}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      />
      <Row gutter={16}>
        <Col span={6}>
          <CustomDropdown
            value={name}
            onNameChange={handleNameChange}
            onAddNewVendor={(newVendor) => {
              setName(newVendor);
            }}
            style={{ width: '100%', marginBottom: '16px' }}
          />
          {console.log(setName)}
        </Col>
        <Col span={6}>
          <Input
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            placeholder="Invoice Date"
            value={invoiceDate ? moment(invoiceDate) : null}
            onChange={(date) => setInvoiceDate(date ? date.toDate() : null)}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            placeholder="Delivery Date"
            value={deliveryDate ? moment(deliveryDate) : null}
            onChange={(date) => setDeliveryDate(date ? date.toDate() : null)}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={handleAddHeader}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Add Column
          </Button>
        </Col>
        <Col>
          <Button
            onClick={handleAddRow}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Add Row
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey={(record, index) => index}
        style={{
          marginTop: '20px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      />
  
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col>
          <ColumnSelector />
        </Col>
        <Col>
          <Button
            onClick={calculateColumnTotal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Calculate Column Total
          </Button>
        </Col>
        <Col>
          Total:{' '}
          <input
            value={totalAmount}
            readOnly
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col>
          <Button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Save
          </Button>
        </Col>
        <Col>
          <Button
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CustomTable;
