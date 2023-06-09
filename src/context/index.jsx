import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../services";

export const AppContext = createContext();

export const AppState = ({ children }) => {
  const info = JSON.parse(localStorage.getItem("admin"));
  const [user, setUser] = useState(info || null);
  const [isLoading, setIsLoading] = useState(null);
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("admin", JSON.stringify(user));
    }
  }, [user]);

  const actionLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        email,
        password,
        operation: "authenticate_admin",
      });
      if (resp?.data?.status === 404) {
        setIsLoading(false);
        toast.error(resp?.data?.message);
        return false;
      }
      if (resp?.data?.status === 200) {
        console.log(resp?.data);
        if (resp?.data?.role === "master") {
          localStorage.setItem(
            "admin",
            JSON.stringify({ role: "master", email, password })
          );
          setUser({ role: "master", email, password });
        }
        if (resp?.data?.role === "verifier") {
          localStorage.setItem(
            "admin",
            JSON.stringify({ role: "verifier", email, password })
          );
          setUser({ role: "verifier", email, password });
        }
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        operation: "get_doctors",
        verifier_email: user.email,
        only_verified: false,
      });
      // console.log(resp);
      if (resp?.data?.status === 200) {
        setDoctors(resp?.data?.doctors);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  const createTm = async (tmInfo) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        ...tmInfo,
        operation: "create_tm",
      });
      if (resp?.data?.status === 200) {
        toast.success("TM created successfully");
      }
      if (resp?.data?.status === 404) {
        toast.error(resp?.data?.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };
  const store = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    actionLogin,
    fetchDoctors,
    doctors,
    setDoctors,
    createTm,
  };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
