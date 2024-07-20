import React from "react";
import { Col, Row } from 'antd';

const UserHome = () => {
    return (
        <div>
            <Row justify="center" style={{ height: '10rem' }}>
                <Col span={24} style={{ display: 'flex', alignItems: 'center', marginLeft: '50%', border: '1px solid black' }}><h1>Welcome to your home</h1></Col>
            </Row>
            <Row>
                <Col span={12} style={{ border: '1px solid black', alignItems: 'center', marginLeft: '50%' }}>insights</Col>
                <Col span={12} style={{ border: '1px solid black' }}>insights</Col>
            </Row>
            <Row>
                <Col span={8} style={{ border: '1px solid black' }}>col-8</Col>
                <Col span={8} style={{ border: '1px solid black' }}>col-8</Col>
                <Col span={8} style={{ border: '1px solid black' }}>col-8</Col>
            </Row>
            <Row>
                <Col span={6} style={{ border: '1px solid black' }}>col-6</Col>
                <Col span={6} style={{ border: '1px solid black' }}>col-6</Col>
                <Col span={6} style={{ border: '1px solid black' }}>col-6</Col>
                <Col span={6} style={{ border: '1px solid black' }}>col-6</Col>
            </Row>
        </div>
    );
}

export default UserHome;
