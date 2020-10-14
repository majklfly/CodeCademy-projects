import React, { Component } from "react";
import "./BusinessList.css";

import { Business } from "../Business/Business";

export class BusinessList extends Component {
  render() {
    return (
      <div className="BusinessList">
        {this.props.bussinesses.map((business) => (
          <Business business={business} />
        ))}
      </div>
    );
  }
}
