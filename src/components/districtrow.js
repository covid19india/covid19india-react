import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";

function DistrictRow(props) {
  const [districtData, setDistrictData] = useState(props.district);

  useEffect(() => {
    setDistrictData(props.district);
  }, [props.district]);

  return (
    <tr className={props.total ? "is-total" : ""}>
      <td style={{ fontWeight: 600 }}>{districtData[0]}</td>
      <td>{parseInt(districtData[1].confirmed) === 0 ? "-" : districtData[1].confirmed}</td>
      <td style={{ color: parseInt(districtData[1].active) === 0 ? "#B5B5B5" : "inherit" }}>{parseInt(districtData[1].active) == 0 ? "-" : districtData[1].active}</td>
      <td style={{ color: parseInt(districtData[1].recovered) === 0 ? "#B5B5B5" : "inherit" }}>{parseInt(districtData[1].recovered) === 0 ? "-" : districtData[1].recovered}</td>
      <td style={{ color: parseInt(districtData[1].deaths) === 0 ? "#B5B5B5" : "inherit" }}>{parseInt(districtData[1].deaths) === 0 ? "-" : districtData[1].deaths}</td>
    </tr>
  );
}

export default DistrictRow;
