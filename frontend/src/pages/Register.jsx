import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Register.css";

function Register() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFName] = useState("");
  const [last_name, setLName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/user/register/", {
        username,
        password,
        first_name,
        last_name,
      });
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "An error occurred. (username already taken?)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="form-title">Create Account</h1>

        <div className="form-row">
          <label className="form-label">Username</label>
          <input
            className="form-field"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-row">
          <label className="form-label">First Name</label>
          <input
            className="form-field"
            type="text"
            value={first_name}
            onChange={(e) => setFName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Last Name</label>
          <input
            className="form-field"
            type="text"
            value={last_name}
            onChange={(e) => setLName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Password</label>
          <input
            className="form-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {loading ? (
          <LoadingIndicator />
        ) : (
          <button className="form-submit" type="submit">
            Create Account
          </button>
        )}
      </form>
    </div>
  );
}

export default Register;
