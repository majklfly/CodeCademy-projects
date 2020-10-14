import React, { Component } from "react";
import "./BusinessList.css";

import { Business } from "../Business/Business";

export class BusinessList extends Component {
  render() {
    return (
      <div className="BusinessList">
        {this.props.business &&
          this.props.businesses.map((business) => {
            return <Business key={business.id} business={business} />;
          })}
      </div>
    );
  }
}
