import React, { useCallback, useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "../context";
import Fancybox from "../components/Fancybox";
import { toast } from "react-hot-toast";
import { apiService } from "../services";
import moment from "moment";
import { jsPDF } from "jspdf";
import slugify from "slugify";
import "./app.css";
import PDFBG from "./../assets/images/tipbg.png";
import { tipsoptions } from "../utils/tipsoptions";
const statusArray = {
  pending: "Pending",
  approved: "Approved",
};
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const Scientimed = () => {
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
      cell: (state) => {
        return InputComponent("doctor_name", state);
      },
    },
    {
      name: "Speciality",
      sortable: true,
      filterable: true,
      selector: (row) => row.speciality,
      cell: (state) => {
        return InputComponent("speciality", state);
      },
    },
    {
      name: "City/Region",
      sortable: true,
      filterable: true,
      selector: (state) => state.city_region,
      cell: (state) => {
        return InputComponent("city_region", state);
      },
    },
    {
      name: "State",
      selector: (state) => state.state,
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("state", state);
      },
    },
    {
      name: "Hq",
      selector: (state) => state.hq,
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("hq", state);
      },
    },
    {
      name: "Train No.",
      width: "100px",
      selector: (state) => state.train_number,
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("train_number", state);
      },
    },
    {
      name: "Date Of Distribution",
      selector: (state) => state.train_date,
      width: "160px",
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("train_date", state);
      },
    },
    {
      name: "Action",
      cell: (state) => {
        return (
          <div className="flex gap-2 items-center justify-center">
            <button
              className="btn flex-shrink-0"
              disabled={state.status === "approved"}
              onClick={() => saveData(state)}
            >
              Save
            </button>
            <select
              name="status"
              id="status"
              className="form-control"
              style={{ width: "150px" }}
              value={state.status}
              onChange={(e) => changeStatus(e.target.value, state)}
            >
              {Object.entries(statusArray).map((i, index) => {
                return (
                  <option value={i[0]} key={index}>
                    {i[1]}
                  </option>
                );
              })}
            </select>
          </div>
        );
      },
    },
  ]);
  const InputComponent = (name, state) => {
    const handleChange = (e, doctor_code) => {
      const { name, value } = e.target;

      const editData = data.map((item) => {
        return item.doctor_code === doctor_code && name
          ? {
              ...item,
              [name]:
                name === "train_date"
                  ? moment(value).format("YYYYMMDD") + "000000"
                  : value,
            }
          : item;
      });
      setData(editData);
    };

    if (
      name === "train_number" ||
      (name === "train_date" && state.status !== "approved")
    ) {
      return (
        <>
          {name === "train_date" ? (
            <DateInput name={name} state={state} handleChange={handleChange} />
          ) : (
            <TextInput name={name} state={state} handleChange={handleChange} />
          )}
        </>
      );
    } else if (name === "train_date" && state.status === "approved") {
      return (
        <div className="non-editable-text">
          {moment(state[name], "YYYYMMDDHHmmss").format("DD-MM-YYYY")}
        </div>
      );
    } else {
      return <div className="non-editable-text">{state[name]}</div>;
    }
  };
  const saveData = async (state, changedStatus, pdf_path) => {
    if (
      !state.doctor_code.trim().length ||
      !state.speciality.trim().length ||
      !state.city_region.trim().length ||
      !state.state.trim().length ||
      !state.hq.trim().length
    ) {
      toast.error("Please enter all the required fileds");
      return false;
    }
    try {
      const resp = await apiService.post("", {
        ...state,
        operation: "verify_tips",
        verifier_email: user?.email,
        status: changedStatus || state.status,
        pdf_path: pdf_path || state.pdf_path,
      });
      if (resp?.data?.status === 200) {
        const updatedData = data.map((item) => {
          return item.doctor_code === state.doctor_code
            ? { ...resp?.data?.doctor, sr: state.sr }
            : item;
        });
        setData(updatedData);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const changeStatus = async (changedStatus, state) => {
    const canchange = [state.train_date, state.train_number].every(Boolean);
    console.log(state.doctor_code, "doctor code");
    console.log(state.train_number, "train number");
    console.log(state.train_date, "train date");
    if (!canchange && changedStatus === "approved") {
      toast.error("Please enter all the required fileds");
      return false;
    }
    try {
      const resp = await apiService.post("", {
        operation: "update_train_info",
        doctor_code: state.doctor_code,
        train_number: state.train_number,
        train_daterr: state.train_date,
      });
      if (resp?.data?.status === 200) {
        console.log("Train info updated");
        toast.success("Status changed successfully");
        const newarr = [];
        if (!newarr.length) {
          for (const items of tipsoptions) {
            for (const s of resp?.data?.tips) {
              if (s.tip_id.toString() === items.id.toString()) {
                const newItem = {
                  ...items,
                  text: s.tip,
                };
                newarr.push(newItem);
                break;
              }
            }
          }
        }
        generatePDF(newarr, state, changedStatus);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const generatePDF = async (tips, state, changedStatus) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "a5",
    });
    doc.addImage(PDFBG, "png", 0, 0, 5.8, 8.3);
    tips.map((tip, i) => {
      doc.setFont("helvetica", "", "normal");
      doc.setFontSize(15);
      doc.setTextColor(40, 40, 40);
      doc.addImage(tip.icon, "png", 0.62, 0.757 * i + 1.88, 0.58, 0.58);
      doc.text(tip.text, 1.5, 0.76 * i + 2.1, { maxWidth: 3.6 });
    });
    doc.setFontSize(18);
    doc.setFont("helvetica", "", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(state?.doctor_name, doc.internal.pageSize.getWidth() / 2, 6.3, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.setFont("helvetica", "", "bold");
    doc.text(state?.speciality, doc.internal.pageSize.getWidth() / 2, 6.55, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setFont("helvetica", "", "normal");
    doc.text(
      `${state?.city_region}, ${state?.state}`,
      doc.internal.pageSize.getWidth() / 2,
      6.75,
      {
        align: "center",
      }
    );
    const config = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, */*",
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      let formData = new FormData();
      formData.append(
        "upload_file",
        doc.output("blob"),
        slugify(`${state.hq}_${state.doctor_code}.pdf`)
      );
      formData.append("suffix", slugify(`${state.hq}_${state.doctor_code}`));
      const resp = await apiService.post("/file_upload.php", formData, config);
      if (resp?.data?.status === 200) {
        saveData(state, changedStatus, resp?.data?.filename);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="card shadow !p-0">
      <Fancybox>
        <DataTable
          title="Doctors List"
          pagination
          columns={columns}
          data={data}
          persistTableHead
        />
      </Fancybox>
    </div>
  );
};

export const DateInput = ({ name, state, handleChange }) => {
  const str = state[name]?.toString();
  const newstr = str?.length === 14 ? str.slice(0, 8) : str;
  return (
    <input
      className="input-table"
      type="date"
      name={name}
      value={
        state[name]
          ? moment(newstr).format("YYYY-MM-DD")
          : moment(tomorrow).format("YYYY-MM-DD")
      }
      onChange={(e) => handleChange(e, state.doctor_code)}
      min={tomorrow.toISOString().split("T")[0]}
    />
  );
};
export const TextInput = ({ name, state, handleChange }) => {
  const isApproved = state.status === "approved";
  return (
    <input
      className={`input-table ${isApproved ? "borderless-input" : ""}`}
      type="text"
      name={name}
      value={state[name] || ""}
      disabled={state.status === "approved"}
      onChange={(e) => handleChange(e, state.doctor_code)}
    />
  );
};
export default Scientimed;
