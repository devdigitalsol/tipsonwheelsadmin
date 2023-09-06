import { Link, NavLink, Outlet } from "react-router-dom";
import LOGOIRCTC from "./../assets/images/logo_irctc.png";
import LOGODRL from "./../assets/images/logo_drl.png";
import Loader from "./Loader";
import { useContext } from "react";
import { AppContext } from "../context";
import { AiOutlineLogout } from "react-icons/ai";

const Layout = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AppContext);
  const logoutHandle = () => {
    setIsLoading(true);
    localStorage.removeItem("admin");
    setUser(null);
    setIsLoading(false);
  };
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="px-4 md:py-3 py-2 flex justify-between items-center w-full bg-white shadow">
        <Link to="/">
          <img src={LOGOIRCTC} alt="logo" className="md:h-[70px] h-[50px]" />
        </Link>
        <div className="flex items-center gap-4">
          <img src={LOGODRL} alt="logo" />
          {user && (
            <AiOutlineLogout
              className="text-3xl text-primary cursor-pointer"
              onClick={logoutHandle}
            />
          )}
        </div>
      </div>
      {user && (
        <nav className="px-4 bg-white/60 text-sm flex gap-2 items-center shadow navbar justify-between">
          <div className="flex gap-2">
            <NavLink to="/">Dashboard</NavLink>
            {user?.role === "admin" && (
              <NavLink to="/add-tm">Updated TM</NavLink>
            )}
          </div>
          <div className="text-slate-600">
            Logged in as <b>{user.email}</b>
          </div>
        </nav>
      )}
      <div className="p-4">
        <Outlet />
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default Layout;
