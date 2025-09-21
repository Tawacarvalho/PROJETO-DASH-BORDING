import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.style.scss";
import meuGestorLogo from "../../assets/meu_gestor_logo_transparent.svg"; // Logo exclusiva do login
import group11 from "../../assets/group11.svg"; // imagem decorativa
import facebookIcon from "../../assets/facebook.svg";
import appleIcon from "../../assets/apple.svg";
import googleIcon from "../../assets/google.svg";
import { loginAndGetUser } from "../../services/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // controle do olho
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!login.trim() || !senha.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await loginAndGetUser({ email: login, password: senha });
      navigate("/dashboard");
    } catch (err) {
      const apiMsg = err?.response?.data || err?.message || "Falha no login";
      setError(typeof apiMsg === "string" ? apiMsg : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      {/* convite à esquerda */}
      <div className="convite-login">
        <img src={meuGestorLogo} alt="Meu Gestor Logo" className="login-logo" />
        <h1>Faça seu login em</h1>
        <h3>
          <span className="meu">Meu</span>
          <span className="gestor">Gestor</span>
        </h3>

        <h6>
          Se você ainda não tem uma conta.<br />
          Você pode se{" "}
          <span className="registrar"> Registrar aqui</span>
        </h6>
      </div>

      {/* imagem decorativa no meio */}
      <div className="loginPage__group11">
        <img src={group11} alt="Decorativo group11" />
      </div>

      {/* formulário à direita */}
      <div className="loginPage__content">
        <form onSubmit={handleSubmit} className="login-box">
          <h2>Login</h2>

          <input
            type="text"
            placeholder="E-mail"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <div className="input-password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <a href="#" className="forgot-password">
            Esqueceu sua senha?
          </a>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Login"}
          </button>

          <p className="continue">ou continue com</p>
          <div className="social-icons">
            <img src={facebookIcon} alt="Facebook" />
            <img src={appleIcon} alt="Apple" />
            <img src={googleIcon} alt="Google" />
          </div>
        </form>
      </div>
    </div>
  );
}
