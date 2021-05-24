import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from '@themesberg/react-bootstrap';
import { CompanyPorfolioWidget, TopInvestorsByCompanyWidget, InvestorPieChartWidget, InvestmentAreaCharttWidget } from "../components/Widgets";
import { CompanyTransTbale } from "../components/Tables";

export default () => {
    const { cpnnm } = useParams();

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="d-block mb-md-0 page-title">
                    <h3>{cpnnm}'S PORTFOLIO</h3>
                </div>
            </div>
            <Row className="mt-3">
                <Col xs={12} xl={5} className="mb-4">
                    <CompanyPorfolioWidget companyName={cpnnm} />
                    <TopInvestorsByCompanyWidget companyName={cpnnm} />
                </Col>
                <Col xs={12} xl={7} className="mb-4">
                    <InvestorPieChartWidget companyName={cpnnm} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InvestmentAreaCharttWidget companyName={cpnnm} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <CompanyTransTbale companyName={cpnnm} />
                </Col>
            </Row>
        </>
  );
}