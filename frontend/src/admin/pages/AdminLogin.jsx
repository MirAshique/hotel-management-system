import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

const AdminLogin = () => {
  const { adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submitHandler}>
        <h2>Admin Login</h2>
        <p>Login to access admin dashboard</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn auth-submit">
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
