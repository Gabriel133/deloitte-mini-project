
import React, {useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHandHoldingUsd, faDollarSign, faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card } from '@themesberg/react-bootstrap';
import { InvestmentAreaChart,
  InvestorsPieChart,
  TtlAmtByMthAreaChart, 
  TtlAmtByYrsAreaChart, 
  TopInvestorsBarChart, 
  TopCompanyBarChart, 
  CountriesLineChart, 
  CountriesChart } from "./Charts";
import { apiUrl } from "./constant";
import { Link } from 'react-router-dom';

export const InvestmentAreaCharttWidget = (props) => {
  const { companyName } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}gettransgrpbymthyr?investee=${companyName}`,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0 widget-title">Total Investment </h5>
          <span className="widget-title-rmk">(Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <InvestmentAreaChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const InvestorPieChartWidget = (props) => {
  const { companyName } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}getinvestorsbycompany?investee=${companyName}`,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">Investors‘ Investment Ratio</h5>
        </Card.Header>
        <Card.Body>
          <InvestorsPieChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const TopInvestorsByCompanyWidget = (props) => {
  const { companyName } = props;

  const Investors = (props) => {
    let { title, amount, investtype } = props;

    return (
      <div width="100%" className="custom-card-body d-flex align-items-center justify-content-between border-bottom border-light pb-3 pt-3">
        <Row className="widget-row">
          <Col className="col-padding-top-investors">
            <span className="widget-label"> &nbsp;</span>
            <h6>{title}</h6>
          </Col>
          <Col className="col-padding-top-investors double-layer">
            <span className="widget-label">
              Investor Type
            </span>
            <br />
            <h6 className="widget-figure">{investtype}</h6>
          </Col>
          <Col className="currency-figure col-padding-top-investors">
            <span className="widget-label">	&nbsp;</span>
            <br/>
            <b>
                {_bFormatter(amount)}<FontAwesomeIcon icon={faHandHoldingUsd} className="ms-2" />
            </b>
          </Col>
        </Row>
      </div>
    );
  };

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}gettopinvestorsbycompany?investee=${companyName}`,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">Top 3 Investors</h5>
        </Card.Header>
        <Card.Body className="pt-0">
          {
            data.map(record =>(
              <Investors title={record.INVESTOR} investtype= {record.INVESTOR_TYPE.toString().toUpperCase()} amount={record.TOTAL_AMOUNT} />
            ))
          }
        </Card.Body>
      </Card>
    );
  }; 
}

export const CompanyPorfolioWidget = (props) => {
  const { companyName } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}getcompanyportfolio?investee=${companyName}`,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result[0]);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm mb-1">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-1 pt-1">
            <div><h6>MARKET CAP.</h6></div>
            <div widget-figure><b>{_bFormatter(data.TOTAL_AMOUNT)}<FontAwesomeIcon icon={faDollarSign} className="ms-2" /></b></div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-1 pt-2">
            <div><h6>COUNTRY</h6></div>
            <div><b>{data.COUNTRY}<FontAwesomeIcon icon={faGlobeAsia} className="ms-2" /></b></div>
          </div>
        </Card.Body>
      </Card>
    );
  };
}

export const TotalInvestmentCurrentYearAreaChartWidget = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "getttlamtbymth",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">Total Investment for Recent Year</h5>
          <span className="widget-title-rmk">(Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <TtlAmtByMthAreaChart inputData={data} />
        </Card.Body>
      </Card>
    );
  }; 
}

export const Last5YearsInvestmentAreaChartWidget = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "getttlamtbyyrs",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">Total Investment for Recent 5 Years </h5>
          <span className="widget-title-rmk">(Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <TtlAmtByYrsAreaChart inputData={data} />
        </Card.Body>
      </Card>
    );
  }; 
}

export const Top5InvestorsBarChartWidget = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "gettopinvestors",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0 widget-title">Top 5 Investors </h5>
          <span className="widget-title-rmk">(Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <TopInvestorsBarChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const Top5CompaniesBarChartWidget = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "gettopcompanies",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0 widget-title">Top 5 Companies </h5>
          <span className="widget-title-rmk">(Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <TopCompanyBarChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const TopCompaniesByCountriesWidget = (props) =>{
  const Company = (props) => {
    const { title, amount } = props;

    return (
      <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3 pt-3">
        <div>
          <h5>
            <Link to={`/companyDetail/${title}`}>
              {title}
            </Link>
          </h5>
        </div>
        <div>
          <b>
            <Link to={`/companyDetail/${title}`}>
              {_bFormatter(amount)}<FontAwesomeIcon icon={faHandHoldingUsd} className="ms-2" />
            </Link>
          </b>
        </div>
      </div>
    );
  };

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "gettopcompanybycountries",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      data.map(result => (
        <Col xs={12} xl={4} className="mb-4">
          <div>
            <Card border="light" className="shadow-sm">
              <Card.Header className="border-bottom border-light">
                <h5 className="mb-0">Top 3 Companies in {result.Country == 'United States' ? 'US' : result.Country} </h5>
              </Card.Header>
              <Card.Body className="pt-1">
                {result.Companies.map(cmp => (
                  <Company title={cmp.INVESTEE} amount={cmp.TOTAL_AMOUNT}/>
                ))}
              </Card.Body>
            </Card>
          </div>
        </Col>
      ))
    );
  };
}

export const CountriesLineChartWidget = () =>{
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "getcountriesttlbyyear",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0 widget-title">
            Total Investment By Countries
          </h5>
          <span className="widget-title-rmk"> (Amount in Millions)</span>
        </Card.Header>
        <Card.Body>
          <CountriesLineChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const CountriesChartWidget = () =>{
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "getttlamtbycountries",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">EV Market Share by Countries</h5>
        </Card.Header>
        <Card.Body>
          <CountriesChart inputData={data} />
        </Card.Body>
      </Card>
    );
  };
}

export const TopCountriesWidget = () =>{
  const Country = (props) => {
    const { title, amount } = props;

    return (
      <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3 pt-3">
        <div>
          <h5>{title}</h5>
        </div>
        <div>
          <b className={"text-primary fw-bold"}>
            {_bFormatter(amount)} <FontAwesomeIcon icon={faChartLine} className="ms-2" />
          </b>
        </div>
      </div>
    );
  };

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "gettop3countries",{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
      })
      .catch((err) => {
          setIsLoaded(true);
          setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card border="light" className="shadow-sm">
        <Card.Header className="border-bottom border-light">
          <h5 className="mb-0">Top 3 Countries</h5>
        </Card.Header>
        <Card.Body>
          {
            data.map(record =>(
              <Country title={record.COUNTRY} amount={record.TOTAL_AMOUNT} />
            ))
          }
        </Card.Body>
      </Card>
    );
  };
}

const _bFormatter = (num) => {
  return Math.abs(num) > 999999999 ? Math.sign(num)*((Math.abs(num)/1000000000).toFixed(3)) + 'B' : Math.sign(num)*((Math.abs(num)/1000000).toFixed(3)) + 'M'
}