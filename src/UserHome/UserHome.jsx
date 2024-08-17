import React from "react";
import { Col, Row } from 'antd';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CustomCard = ({ title, content }) => (
    <Card variant="outlined" style={{ width: '100%', margin: '10px 0' }}>
        <CardContent>
            <Typography variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {content}
            </Typography>
        </CardContent>
        <CardActions>
            {/* <Button size="small">Learn More</Button> */}
        </CardActions>
    </Card>
);

const UserHome = () => {
    return (
        <div>
            <Row justify="center" style={{ height: '10rem' }}>
                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                    
                    {/* Card here */}
                    <CustomCard title="Welcome to AI Recepit scanner" content="Scan your recepits and Pay" />
                </Col>
            </Row>
            <Row style={{ padding:"1rem"}}>
                <Col span={12} style={{ alignItems: 'center', paddingRight:'10px' }}>
                       
                    {/* Card here */}
                    <CustomCard title="Receipts Scanned this week" content="This is an insights card." />
                </Col>
                <Col span={12} style={{ paddingRight:'10px' }}>
                    
                    {/* Card here */}
                    <CustomCard title="Payments Due Soon" content="This is another insights card." />
                </Col>
            </Row>
           
        </div>
    );
}

export default UserHome;