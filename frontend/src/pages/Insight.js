import React from "react";
import { CompanyListTbale } from "../components/Tables";

export default () => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2">
        <div className="d-block mb-2 mb-md-0 page-title">
          <h3>INSIGHT</h3>
          <i className="mb-0">Get the insight from particular EV companies</i>
        </div>
      </div>

      <CompanyListTbale />
    </>
  );
};
