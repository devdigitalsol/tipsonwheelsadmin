import React, { useState } from "react";
import moment from "moment";
const Test = () => {
  const [dstr, setDsr] = useState("2023-06-16");
  const handleChange = (e) => {
    setDsr(e.target.value);
    let str = moment(e.target.value).format("YYYYMMDD") + "000000";
    console.log(str);
  };
  return (
    <div>
      <input type="date" value={dstr} onChange={handleChange} />
    </div>
  );
};

export default Test;
