import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const styles = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(29,158,117,0.35)); }
    50%       { filter: drop-shadow(0 0 16px rgba(29,158,117,0.65)); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px);  opacity: 0.18; }
    50%       { transform: translateY(-18px); opacity: 0.28; }
  }
  @keyframes wingFly {
    0%, 100% { transform: scaleX(1); }
    50%       { transform: scaleX(1.08); }
  }

  .hms-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #E1F5EE 0%, #f0faf7 50%, #e8f4ff 100%);
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .hms-orb {
    position: absolute;
    border-radius: 50%;
    background: #1D9E75;
    animation: orbFloat linear infinite;
    pointer-events: none;
  }

  .hms-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.1);
    border-radius: 16px;
    padding: 2.5rem 2rem 2rem;
    width: 100%;
    max-width: 380px;
    position: relative;
    z-index: 2;
    animation: fadeInUp 0.6s ease both;
    box-shadow: 0 4px 40px rgba(29,158,117,0.08);
  }

  .hms-logo-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    animation: fadeInDown 0.7s ease both;
  }

  .hms-logo-svg {
    animation: glowPulse 2.8s ease-in-out infinite;
  }

  .hms-title {
    font-size: 22px;
    font-weight: 600;
    color: #0F6E56;
    letter-spacing: 0.06em;
    margin: 10px 0 0;
    text-align: center;
    text-transform: uppercase;
  }

  .hms-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1.25rem 0 1rem;
    color: #888;
    font-size: 12px;
  }
  .hms-divider::before,
  .hms-divider::after {
    content: '';
    flex: 1;
    height: 0.5px;
    background: rgba(0,0,0,0.1);
  }

  .hms-form-group {
    margin-bottom: 1rem;
    animation: fadeInUp 0.5s ease both;
  }
  .hms-form-group:nth-child(1) { animation-delay: 0.15s; }
  .hms-form-group:nth-child(2) { animation-delay: 0.25s; }

  .hms-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #666;
    margin-bottom: 5px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .hms-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .hms-input-icon {
    position: absolute;
    left: 11px;
    font-size: 17px;
    color: #1D9E75;
    pointer-events: none;
  }

  .hms-input {
    width: 100%;
    background: #f8fdfb;
    color: #111;
    box-sizing: border-box;
    padding: 10px 38px 10px 38px;
    border: 0.5px solid rgba(0,0,0,0.15);
    border-radius: 8px;
    font-size: 14px;
    background: #f8fdfb;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
  }
  .hms-input:focus {
    border-color: #1D9E75;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.12);
    background: #fff;
  }

  .hms-btn {
    width: 100%;
    padding: 11px;
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5rem;
    letter-spacing: 0.04em;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeInUp 0.6s 0.35s ease both;
  }
  .hms-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(29,158,117,0.35);
  }
  .hms-btn:active { transform: scale(0.98); }

  .hms-footer {
    text-align: center;
    font-size: 11px;
    color: #aaa;
    margin-top: 1.25rem;
  }
    .hms-eye-icon {
      position: absolute;
      right: 11px;
      font-size: 17px;
      cursor: pointer;
      user-select: none;
      color: #1D9E75;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
    }
    .hms-eye-icon:hover {
      opacity: 0.7;
    }
`;

function CaduceusLogo() {
  return (
    <svg
      className="hms-logo-svg"
      width="90"
      height="90"
      viewBox="0 0 90 90"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Caduceus medical logo"
    >
      <defs>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5DCAA5" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
      </defs>

      {/* Staff */}
      <rect x="43" y="12" width="4" height="66" rx="2" fill="url(#tealGrad)" />

      {/* Orb top */}
      <circle cx="45" cy="10" r="5" fill="#1D9E75">
        <animate attributeName="r" values="5;6.2;5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Wings */}
      <g style={{ transformOrigin: "45px 30px", animation: "wingFly 3s ease-in-out infinite" }}>
        <path d="M45 28 C30 20 12 22 8 28 C12 32 28 32 45 32" fill="url(#tealGrad)" opacity="0.85" />
      </g>
      <g style={{ transformOrigin: "45px 30px", animation: "wingFly 3s ease-in-out infinite" }}>
        <path d="M45 28 C60 20 78 22 82 28 C78 32 62 32 45 32" fill="url(#tealGrad)" opacity="0.85" />
      </g>

      {/* Snake 1 */}
      <path d="M45 35 C36 42 50 50 40 58 C32 64 46 70 45 76"
        fill="none" stroke="#5DCAA5" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d"
          values="M45 35 C36 42 50 50 40 58 C32 64 46 70 45 76;
                  M45 35 C54 42 38 50 48 58 C56 64 42 70 45 76;
                  M45 35 C36 42 50 50 40 58 C32 64 46 70 45 76"
          dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* Snake 2 */}
      <path d="M45 35 C54 42 38 50 48 58 C56 64 42 70 45 76"
        fill="none" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d"
          values="M45 35 C54 42 38 50 48 58 C56 64 42 70 45 76;
                  M45 35 C36 42 50 50 40 58 C32 64 46 70 45 76;
                  M45 35 C54 42 38 50 48 58 C56 64 42 70 45 76"
          dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* Snake heads */}
      <ellipse cx="40" cy="33" rx="4" ry="3" fill="#0F6E56">
        <animate attributeName="cx" values="40;48;40" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="50" cy="33" rx="4" ry="3" fill="#1D9E75">
        <animate attributeName="cx" values="50;42;50" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Invalid Credentials");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hms-wrap">
        {/* Floating background orbs */}
        <div className="hms-orb" style={{ width: 180, height: 180, top: -60, left: -60, animationDuration: "7s" }} />
        <div className="hms-orb" style={{ width: 100, height: 100, bottom: -30, right: -20, animationDuration: "9s", animationDelay: "2s" }} />
        <div className="hms-orb" style={{ width: 60, height: 60, top: "40%", right: "8%", animationDuration: "5s", animationDelay: "1s" }} />

        <div className="hms-card">
          {/* Logo */}
          <div className="hms-logo-area">
            <CaduceusLogo />
            <p className="hms-title">Hospital Management System</p>
          </div>

          <div className="hms-divider">Sign in to continue</div>

          <form onSubmit={handleSubmit}>
            <div className="hms-form-group">
              <label className="hms-label">Username</label>
              <div className="hms-input-wrap">
                <span className="hms-input-icon">👤</span>
                <input
                  className="hms-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="hms-form-group">
              <label className="hms-label">Password</label>
              <div className="hms-input-wrap">
                <span className="hms-input-icon">🔒</span>
                <input
                  className="hms-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="hms-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <button className="hms-btn" type="submit">
              Sign In →
            </button>
          </form>

          <p className="hms-footer">© 2026 · Secure Login</p>
        </div>
      </div>
    </>
  );
}

export default Login;