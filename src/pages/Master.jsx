import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "../context";
import moment from "moment";
import * as XLSX from "xlsx";
import { apiService } from "../services";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
const Master = () => {
  const newtoday = moment(new Date()).format("DD-MM-YYYY");

  const navigate = useNavigate();
  const { doctors, fetchDoctors, user } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [selectDate, setSelectDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const datehandleChange = (e) => {
    setSelectDate(e.target.value);
  };

  const handleRowSelect = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.sr === row.sr
    );

    if (isSelected) {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.sr !== row.sr)
      );
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

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

  const clearData = () => {
    setSelectDate("");
  };

  const columns = useCallback([
    {
      name: "",
      cell: (row) => (
        <input type="checkbox" onChange={() => handleRowSelect(row)} />
      ),
      width: "50px",
    },
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
      name: <Tilte title={`Date of Distribution<br/>DD/MM/YYYY`} />,
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
        "DD/MM/YYYY"
      );
    }
  };

  const actionExport = useMemo(() => {
    const exportToXlsx = (data) => {
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws1, "Doctors");
      XLSX.writeFile(wb, `${newtoday}-master.xlsx`);
      return false;
    };
    // const exportPdf = async (data) => {
    //   console.log(data, moment(selectDate).format("YYYYMMDD") + "000000");
    //   let allResult;
    //   if (selectDate) {
    //     const filterNewArr = data.filter((element) => {
    //       return (
    //         element.train_date ===
    //         moment(selectDate).format("YYYYMMDD") + "000000"
    //       );
    //     });
    //     allResult = filterNewArr;
    //   } else {
    //     allResult = data;
    //   }
    //   const result = allResult.map(({ doctor_code, pdf_path }) => ({
    //     doctor_code,
    //     pdf_path,
    //   }));
    //   try {
    //     const resp = await apiService.post("", {
    //       operation: "export_pdfs",
    //       pdf_data: result,
    //     });
    //     if (resp.data?.status === 200) {
    //       window.open(resp.data?.zip_path, "_blank");
    //     }
    //     console.log(resp);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const exportPdfForSelectedRows = async () => {
      const selectedDoctorCodes = selectedRows.map((row) => row.doctor_code);
      const result = data
        .filter((row) => selectedDoctorCodes.includes(row.doctor_code))
        .map(({ doctor_code, pdf_path }) => ({
          doctor_code,
          pdf_path,
        }));

      if (result.length === 0) {
        console.log("No rows selected.");
        return;
      }

      try {
        const resp = await apiService.post("", {
          operation: "export_pdfs",
          pdf_data: result,
        });
        if (resp.data?.status === 200) {
          window.open(resp.data?.zip_path, "_blank");
        }
        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div className="flex gap-6 items-center justify-center">
        <div className="flex gap-2 items-center justify-center">
          <input
            type="date"
            className="form-control"
            value={selectDate}
            onChange={datehandleChange}
          />
          <button
            className="btn shrink-0"
            onClick={() => exportPdfForSelectedRows(data)}
          >
            Download PDF
          </button>
          <button className="btn !bg-gray-400 shrink-0" onClick={clearData}>
            Clear
          </button>
        </div>
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
export default Master;
export const Tilte = ({ title }) => {
  return <div>{parse(title)}</div>;
};

// import { useCallback, useContext, useEffect, useMemo, useState } from "react";
// import DataTable from "react-data-table-component-with-filter";
// import { AppContext } from "../context";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import { apiService } from "../services";
// import { useNavigate } from "react-router-dom";
// import parse from "html-react-parser";
// const Master = () => {
//   const newtoday = moment(new Date()).format("DD-MM-YYYY");

//   const navigate = useNavigate();
//   const { doctors, fetchDoctors, user } = useContext(AppContext);
//   const [data, setData] = useState([]);
//   const [selectDate, setSelectDate] = useState("");

//   const datehandleChange = (e) => {
//     setSelectDate(e.target.value);
//   };

//   useEffect(() => {
//     if (doctors?.length > 0) {
//       const filteredData = doctors.filter((item) => {
//         return item.status === "approved";
//       });

//       const docs = filteredData.map((item, index) => {
//         return { ...item, sr: index + 1 };
//       });
//       setData(docs);
//     }
//   }, [doctors]);
//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const clearData = () => {
//     setSelectDate("");
//   };

//   const columns = useCallback([
//     {
//       name: "Sr.",
//       width: "50px",
//       selector: (row) => row.sr,
//     },
//     {
//       name: "Dr. Code",
//       sortable: true,
//       filterable: true,
//       width: "100px",
//       selector: (row) => row.doctor_code,
//     },
//     {
//       name: "Doctor Name",
//       sortable: true,
//       filterable: true,
//       selector: (row) => row.doctor_name,
//     },
//     {
//       name: "Speciality",
//       sortable: true,
//       filterable: true,
//       selector: (row) => row.speciality,
//     },
//     {
//       name: "City/Region",
//       sortable: true,
//       filterable: true,
//       selector: (state) => state.city_region,
//     },
//     {
//       name: "State",
//       selector: (state) => state.state,
//       sortable: true,
//       filterable: true,
//     },
//     {
//       name: "Hq",
//       selector: (state) => state.hq,
//       sortable: true,
//       filterable: true,
//     },
//     {
//       name: "Train No.",
//       width: "100px",
//       selector: (state) => state.train_number,
//       sortable: true,
//       filterable: true,
//     },
//     {
//       name: <Tilte title={`Date of Distribution<br/>DD/MM/YYYY`} />,
//       selector: (state) => state.train_date,
//       width: "160px",
//       cell: (state) => {
//         return ShowDate(state.train_date);
//       },
//     },
//   ]);

//   const ShowDate = (str) => {
//     if (str === null || str === "") {
//       return "";
//     } else {
//       const strToNum = Number(str);
//       const numToStr = strToNum.toString();
//       return moment(numToStr.substring(0, numToStr.length - 6)).format(
//         "DD/MM/YYYY"
//       );
//     }
//   };

//   const actionExport = useMemo(() => {
//     const exportToXlsx = (data) => {
//       let wb = XLSX.utils.book_new();
//       let ws1 = XLSX.utils.json_to_sheet(data);
//       XLSX.utils.book_append_sheet(wb, ws1, "Doctors");
//       XLSX.writeFile(wb, `${newtoday}-master.xlsx`);
//       return false;
//     };
//     const exportPdf = async (data) => {
//       console.log(data, moment(selectDate).format("YYYYMMDD") + "000000");
//       let allResult;
//       if (selectDate) {
//         const filterNewArr = data.filter((element) => {
//           return (
//             element.train_date ===
//             moment(selectDate).format("YYYYMMDD") + "000000"
//           );
//         });
//         allResult = filterNewArr;
//       } else {
//         allResult = data;
//       }
//       const result = allResult.map(({ doctor_code, pdf_path }) => ({
//         doctor_code,
//         pdf_path,
//       }));
//       try {
//         const resp = await apiService.post("", {
//           operation: "export_pdfs",
//           pdf_data: result,
//         });
//         if (resp.data?.status === 200) {
//           window.open(resp.data?.zip_path, "_blank");
//         }
//         console.log(resp);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     return (
//       <div className="flex gap-6 items-center justify-center">
//         <div className="flex gap-2 items-center justify-center">
//           <input
//             type="date"
//             className="form-control"
//             value={selectDate}
//             onChange={datehandleChange}
//           />
//           <button className="btn shrink-0" onClick={() => exportPdf(data)}>
//             Bulk PDF
//           </button>
//           <button className="btn !bg-gray-400 shrink-0" onClick={clearData}>
//             Clear
//           </button>
//         </div>
//         <button className="btn shrink-0" onClick={() => exportToXlsx(data)}>
//           Download XLSX
//         </button>
//       </div>
//     );
//   });

//   return (
//     <div className="card shadow !p-0">
//       <DataTable
//         title="Doctors List"
//         pagination
//         columns={columns}
//         data={data}
//         persistTableHead
//         actions={actionExport}
//       />
//     </div>
//   );
// };
// export default Master;
// export const Tilte = ({ title }) => {
//   return <div>{parse(title)}</div>;
// };
