import { useContext, useRef, useState } from "react";
import { AppContext } from "../context";

const AddTM = () => {
  const tmFormRef = useRef();
  const { createTm, allHq } = useContext(AppContext);
  const [tmInfo, setTmInfo] = useState({
    tm_id: "",
    old_tm_id: "",
    tm_name: "",
    l1_name: "",
    l2_name: "",
    l3_name: "",
    team: "",
    hq: "",
  });
  const canSave = [
    tmInfo?.tm_id?.trim().length,
    tmInfo?.old_tm_id?.trim().length,
    tmInfo?.tm_name?.trim().length,
    tmInfo?.l1_name?.trim().length,
    tmInfo?.l2_name?.trim().length,
    tmInfo?.l3_name?.trim().length,
    tmInfo?.team?.trim().length,
    tmInfo?.hq?.trim().length,
  ].every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTm(tmInfo);
    tmFormRef.current.reset();
  };
  return (
    <form
      onSubmit={handleSubmit}
      ref={tmFormRef}
      className="card max-w-md mx-auto shadow"
    >
      <h4 className="text-xl font-bold mb-3 ">Add New TM</h4>
      <div className="form-group">
        <label htmlFor="tm_id" className="form-label">
          TM ID
        </label>
        <input
          type="text"
          id="tm_id"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, tm_id: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="old_tm_id" className="form-label">
          Old TM ID
        </label>
        <input
          type="text"
          id="old_tm_id"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, old_tm_id: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="tm_name" className="form-label">
          TM Name
        </label>
        <input
          type="text"
          id="tm_name"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, tm_name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="l1_name" className="form-label">
          L1 Name
        </label>
        <input
          type="text"
          id="l1_name"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, l1_name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="l2_name" className="form-label">
          L2 Name
        </label>
        <input
          type="text"
          id="l2_name"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, l2_name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="l3_name" className="form-label">
          L3 Name
        </label>
        <input
          type="text"
          id="l3_name"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, l3_name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="team" className="form-label">
          Team
        </label>
        <input
          type="text"
          id="team"
          className="form-control"
          onChange={(e) => setTmInfo({ ...tmInfo, team: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="hq" className="form-label">
          Headquarter
        </label>

        {allHq?.length > 0 && (
          <select
            name="hq"
            id="hq"
            onChange={(e) => setTmInfo({ ...tmInfo, hq: e.target.value })}
            className="form-control"
          >
            <option value="" defaultValue>
              Select
            </option>
            {allHq.map((item, i) => {
              return (
                <option value={i} key={i}>
                  {item}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <button disabled={!canSave} type="submit" className="btn">
        Submit
      </button>
    </form>
  );
};
export default AddTM;
