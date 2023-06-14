import { useContext } from "react";
import { AppContext } from "../context";
import Admin from "./Admin";
import Verifier from "./Verifier";
import Master from "./Master";

const Home = () => {
  const { user } = useContext(AppContext);
  if (user?.role === "admin") {
    return <Admin />;
  }
  if (user?.role === "verifier") {
    return <Verifier />;
  }
  if (user?.role === "master") {
    return <Master />;
  }
};
export default Home;
