import React from 'react';
import SubHeading from '../layout/SubHeading';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function OurGuarantees() {
    return (
        <div className="our--guarantees">
            <SubHeading  content="Our guarantees" />
            <Container>
                <Row>
                    <Col xs={12} md={4}>
                        <i className="fas fa-tags"></i><span>Best deals</span>
                    </Col>
                    <Col xs={12} md={4}>
                        <i className="fas fa-phone"></i><span>24/7 service</span>
                    </Col>
                    <Col xs={12} md={4}>
                        <i className="fas fa-undo"></i><span>Free cancellation</span>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default OurGuarantees
