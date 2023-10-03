import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "../context";
import moment from "moment";
import * as XLSX from "xlsx";

const Admin = () => {
  const { doctors, fetchDoctors, user } = useContext(AppContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (doctors?.length > 0) {
      const filteredData = doctors.filter((item) => {
        return item.status === "approved";
      });

      const docs = filteredData.map((item, index) => {
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
      name: "Date Of Distribution",
      selector: (state) => state.train_date,
      width: "160px",
      cell: (state) => {
        return ShowDate(state.train_date);
      },
    },
  ]);

  const ShowDate = (str) => {
    if (str === null || str === "") {
      return "";
    } else {
      const strToNum = Number(str);
      const numToStr = strToNum.toString();
      return moment(numToStr.substring(0, numToStr.length - 6)).format(
        "MM/DD/YYYY"
      );
    }
  };

  const actionExport = useMemo(() => {
    const exportToXlsx = (data) => {
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(data);
      ws1["!cols"] = [];
      ws1["!cols"][12] = { hidden: true };
      ws1["!cols"][16] = { hidden: true };
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
      XLSX.writeFile(wb, `test.xlsx`);
      return false;
    };
    return (
      <div className="flex gap-3 items-center justify-center">
        <button className="btn shrink-0" onClick={() => exportToXlsx(data)}>
          Download XLSX
        </button>
      </div>
    );
  });
  return (
    <div className="card shadow !p-0">
      <DataTable
        title="Doctors List"
        pagination
        columns={columns}
        data={data}
        persistTableHead
        actions={actionExport}
      />
    </div>
  );
};
export default Admin;
