import { Link, Outlet } from "react-router-dom";
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
        <div className="py-2 px-4 bg-white/60 text-sm">
          Logged in as {user.email}
        </div>
      )}
      <div className="p-4">
        <Outlet />
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default Layout;
