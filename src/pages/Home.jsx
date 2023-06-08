import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "../context";
import Fancybox from "../components/Fancybox";
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
      setData(doctors);
    }
  }, [doctors]);
  useEffect(() => {
    fetchDoctors();
  }, []);
  const columns = useCallback([
    {
      name: "Dr. Code",
      sortable: true,
      filterable: true,
      maxWidth: "100px",
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
      contextComponent: () => "asd",
    },
    {
      name: "Train No.",
      selector: (state) => state.train_number,
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("train_number", state);
      },
    },
    {
      name: "Publish Date",
      selector: (state) => state.train_date,
      sortable: true,
      filterable: true,
      cell: (state) => {
        return InputComponent("train_date", state);
      },
    },
    {
      name: "Image",
      selector: (state) => state.media_path,
      maxWidth: "60px",
      cell: (state) => {
        return (
          <a href={state.media_path} data-fancybox>
            <img src={state.media_path} alt={state.doctor_name} width={40} />
          </a>
        );
      },
    },
    {
      maxWidth: "250px",
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
    return (
      <>
        {name === "train_date" ? (
          <DateInput name={name} state={state} handleChange={handleChange} />
        ) : (
          <TextInput name={name} state={state} handleChange={handleChange} />
        )}
      </>
    );
  };

  const saveData = async (state) => {
    try {
      const resp = await apiService.post("", {
        ...state,
        operation: "verify_tips",
        verifier_email: user?.email,
      });
      if (resp?.data?.status === 200) {
        const updatedData = data.map((item) => {
          return item.doctor_code === state.doctor_code
            ? resp?.data?.doctor
            : item;
        });
        setData(updatedData);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  const changeStatus = async (e, state) => {
    try {
      const resp = await apiService.post("", {
        ...state,
        operation: "verify_tips",
        status: e,
        verifier_email: user?.email,
      });
      if (resp?.data?.status === 200) {
        const updatedData = data.map((item) => {
          return item.doctor_code === state.doctor_code
            ? resp?.data?.doctor
            : item;
        });
        setData(updatedData);
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
          : moment(new Date()).format("YYYY-MM-DD")
      }
      disabled={state.status === "approved"}
      onChange={(e) => handleChange(e, state.doctor_code)}
    />
  );
};
export const TextInput = ({ name, state, handleChange }) => {
  return (
    <input
      className="input-table"
      type="text"
      name={name}
      value={state[name] || ""}
      disabled={state.status === "approved"}
      onChange={(e) => handleChange(e, state.doctor_code)}
    />
  );
};
export default Home;
