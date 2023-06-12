import { useContext } from "react";
import { AppContext } from "../context";

const BulkDownload = () => {
  const { allHq } = useContext(AppContext);
  return <div>BulkDownload</div>;
};
export default BulkDownload;
