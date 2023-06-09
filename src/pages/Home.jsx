import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "../context";
import { toast } from "react-hot-toast";
import { apiService } from "../services";
import moment from "moment";
const statusArray = {
  pending: "Pending",
  approved: "Approved",
  "rejected-1": "Image is not appropriate",
  "rejected-2": "Entered data is not appropriate",
};
const Home = () => {
  const { doctors, fetchDoctors, user } = useContext(AppContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (doctors?.length > 0) {
      const docs = doctors.map((item, index) => {
        return { ...item, sr: index + 1 };
      });
      setData(docs);
    }
  }, [doctors]);
  useEffect(() => {
    fetchDoctors();
  }, []);
  const columns = useCallback([
    {
      name: "Sr.",
      width: "50px",
      selector: (row) => row.sr,
    },
    {
      name: "Dr. Code",
      sortable: true,
      filterable: true,
      width: "100px",
      selector: (row) => row.doctor_code,
    },
    {
      name: "Doctor Name",
      sortable: true,
      filterable: true,
      selector: (row) => row.doctor_name,
    },
    {
      name: "Speciality",
      sortable: true,
      filterable: true,
      selector: (row) => row.speciality,
    },
    {
      name: "City/Region",
      sortable: true,
      filterable: true,
      selector: (state) => state.city_region,
    },
    {
      name: "State",
      selector: (state) => state.state,
      sortable: true,
      filterable: true,
    },
    {
      name: "Hq",
      selector: (state) => state.hq,
      sortable: true,
      filterable: true,
    },
    {
      name: "Train No.",
      width: "100px",
      selector: (state) => state.train_number,
      sortable: true,
      filterable: true,
    },
    {
      name: "Publish Date",
      selector: (state) => state.train_date,
      width: "160px",
      sortable: true,
      filterable: true,
    },
  ]);

  return (
    <div className="card shadow !p-0">
      <DataTable
        title="All Doctors List"
        pagination
        columns={columns}
        data={data}
        persistTableHead
      />
    </div>
  );
};

export default Home;
