import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Login.css";

function Login() {
  const { login } = useAuth(); // Get the login function from AuthContext
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      // Fetch user details to get the first and last name
      const userRes = await api.get("/api/me/");
      const { first_name, last_name } = userRes.data;

      login(username, first_name, last_name); // Update isAuthorized on successful login
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.detail || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Sign in</h1>

        <div className="input-group">
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>

        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <button className="btn-signin" type="submit">
              Sign In
            </button>
            <a href="/register" className="btn-link">
              Create an account
            </a>
          </>
        )}
      </form>
    </div>
  );
}

export default Login;
