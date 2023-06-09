import { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  //   useEffect(() => {
  //     localStorage.removeItem("admin");
  //     setUser(null);
  //     navigate("/login");
  //   }, []);
  return <div>Unauthorized</div>;
};
export default Unauthorized;
