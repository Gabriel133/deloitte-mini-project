
import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { TotalInvestmentCurrentYearAreaChartWidget, 
  Last5YearsInvestmentAreaChartWidget, 
  Top5InvestorsBarChartWidget, 
  Top5CompaniesBarChartWidget, 
  TopCompaniesByCountriesWidget, 
  CountriesLineChartWidget, 
  TopCountriesWidget, 
  CountriesChartWidget } from "../components/Widgets";

export default () => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
          <div className="d-block mb-md-0 page-title">
              <h3>MARKET OVERVIEW</h3>
          </div>
      </div>
      <Row className="mt-4">
        <Col xs={12} xl={5} className="mb-4">
          <TopCountriesWidget />
        </Col>
        <Col xs={12} xl={7} className="mb-4">
          <CountriesChartWidget />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <CountriesLineChartWidget />
        </Col>
      </Row>
      <Row>
        <TopCompaniesByCountriesWidget />
      </Row>

      <Row>
        <Col xs={12} xl={6} className="mb-4">
          <div>
            <Top5CompaniesBarChartWidget />
          </div>
        </Col>
        <Col xs={12} xl={6} className="mb-4">
          <div>
            <Top5InvestorsBarChartWidget />
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={6} className="mb-4">
          <div>
            <Last5YearsInvestmentAreaChartWidget />
          </div>
        </Col>
        <Col xs={12} xl={6} className="mb-4">
          <div>
            <TotalInvestmentCurrentYearAreaChartWidget />
          </div>
        </Col>
      </Row>
    </>
  );
};
