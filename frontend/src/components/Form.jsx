import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { useUser } from '../UserContext';
import { useNotification } from "../NotificationContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useUser();
  const { message, clearMessage } = useNotification();

  const isLogin = method === "login";
  const formTitle = isLogin ? "Logowanie" : "Rejestracja";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    const formData = isLogin
      ? { email, password }
      : { email, password, confirm_password: confirmPassword, first_name: firstName, last_name: lastName };

    try {
      const res = await axios.post(`http://127.0.0.1:8000/${route}`, formData);
      if (isLogin) {
        login(res.data.access, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        setErrors(backendErrors); 
      } else {
        setErrors({ general: "Wystąpił błąd. Spróbuj ponownie." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
        toast.error(message);
        clearMessage();
    }
}, [message]);

  return (
    <div className="form-back"> 
      <form onSubmit={handleSubmit} className="form-container">
        <h><strong>{formTitle}</strong></h>
        {errors.general && <p className="form-error">{errors.general}</p>}

          <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
      
          <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          required
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
      
      {!isLogin && (
          <>
              <input
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Powtórz hasło"
              required
              />
              {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword}</p>
              )}

              <input
              className="form-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Imię"
              required
              />
              {errors.first_name && (
              <p className="form-error">{errors.first_name}</p>
              )}

              <input
              className="form-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nazwisko"
              required
              />
              {errors.last_name && (
              <p className="form-error">{errors.last_name}</p>
              )}
          </>
      )}

      {loading && <LoadingIndicator />}

      <button className="form-button" type="submit" disabled={loading}>
        {formTitle}
      </button>
      {isLogin && (
          <p>
            <Link to="/register" className="link-no-underline">Nie masz konta? Zarejestruj się!</Link>
          </p>
        )}
        {!isLogin && (
          <p>
            <Link to="/login" className="link-no-underline">Masz już konto? Zaloguj się!</Link>
          </p>
        )}
      </form>
      <ToastContainer position="top-center"/>
    </div>
  );
}

export default Form;
