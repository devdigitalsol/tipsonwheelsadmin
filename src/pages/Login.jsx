import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context";

const Login = () => {
  const { user, actionLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const cansave = [
    userInfo.email?.trim().length,
    userInfo.password?.trim().length,
  ].every(Boolean);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo.email?.trim().length || !userInfo.password.trim().length) {
      toast.error("Please enter all required information");
      return false;
    }
    await actionLogin(userInfo.email, userInfo.password);
  };

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);
  return (
    <div className="mt-4 w-full px-4">
      <form onSubmit={handleSubmit} className="card max-w-sm mx-auto">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your Email"
            className="form-control"
            id="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your Password"
            className="form-control"
            id="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
