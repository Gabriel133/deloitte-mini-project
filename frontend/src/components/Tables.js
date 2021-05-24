
import React, {useState, useEffect }  from "react";
import { Link } from 'react-router-dom';
import { apiUrl } from "./constant";
import { MDBDataTable } from 'mdbreact';
import { Col, Row } from '@themesberg/react-bootstrap';

export const CompanyTransTbale = (props) => {
  const cpnnm = props.companyName;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}gettrans?investee=${cpnnm}` ,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          result.rows.forEach(element => {
            element.INVESTOR_TYPE = element.INVESTOR_TYPE.toString().toUpperCase();
            element.INVESTMENT_TYPE = element.INVESTMENT_TYPE.toString().toUpperCase();
            element.AMOUNT = element.AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          });
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
      <div className="datatable-panel"> 
          <Row>
              <Col>
                  <MDBDataTable 
                      hover
                      displayEntries={false}
                      noBottomColumns={true}
                      searching={false}
                      responsive
                      data={data}
                  />
              </Col>
          </Row>
      </div>
    );
  };
}

export const CompanyListTbale = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl + 'getcompanies' ,{mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          result.rows.forEach(element => {
            element.DTL_LINK = <Link  to={`/companyDetail/${element.INVESTEE}`} className="table-link-btn">View</Link>
          });
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
      <div className="datatable-panel"> 
          <Row>
              <Col>
                  <MDBDataTable 
                      hover
                      displayEntries={false}
                      noBottomColumns={true}
                      responsive
                      data={data}
                  />
              </Col>
          </Row>
      </div>
    );
  };
}