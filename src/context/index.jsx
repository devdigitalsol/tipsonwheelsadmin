import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../services";

export const AppContext = createContext();

export const AppState = ({ children }) => {
  const info = JSON.parse(localStorage.getItem("admin"));
  const [user, setUser] = useState(info || null);
  const [allHq, setAllHq] = useState([]);
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
        if (resp?.data?.role === "admin") {
          localStorage.setItem(
            "admin",
            JSON.stringify({ role: "admin", email, password })
          );
          setUser({ role: "admin", email, password });
        }
        if (resp?.data?.role === "scientimed") {
          localStorage.setItem(
            "admin",
            JSON.stringify({ role: "scientimed", email, password })
          );
          setUser({ role: "scientimed", email, password });
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

  const fetchHqs = async () => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        operation: "get_headquarters",
      });
      if (resp?.data?.status === 200) {
        setAllHq(resp?.data?.hqs);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchHqs();
    }
  }, [user]);

  const createTm = async (tmInfo) => {
    setIsLoading(true);

    try {
      // Check if old_tm_id exists
      if (tmInfo.old_tm_id) {
        // Make a request to the authentication API
        const authResp = await apiService.post("", {
          operation: "authenticate",
          tm_id: tmInfo.old_tm_id,
          show_tips_details: true,
        });

        if (authResp?.data?.status === 200) {
          // Authentication successful, proceed with create_tm
          const createResp = await apiService.post("", {
            ...tmInfo,
            operation: "create_tm",
          });

          if (createResp?.data?.status === 200) {
            // console.log("Exist and create");
            toast.success("TM created successfully");
          } else {
            toast.error("Failed to create TM");
          }
        } else {
          // Authentication failed, show an error message
          toast.error(authResp?.data?.message);
        }
      } else {
        // old_tm_id is not provided, proceed with create_tm
        const resp = await apiService.post("", {
          ...tmInfo,
          operation: "create_tm",
        });

        if (resp?.data?.status === 200) {
          toast.success("TM created successfully");
        } else if (resp?.data?.status === 404) {
          toast.error(resp?.data?.message);
        } else {
          toast.error("Failed to create TM");
        }
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
    allHq,
  };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
