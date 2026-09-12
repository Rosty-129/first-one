import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  
  // Nouveaux states pour la réinitialisation de mot de passe
  const [step, setStep] = useState(1); // 1 = Login, 2 = Demander code, 3 = Changer mot de passe
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // --- EXPRESSIONS RÉGULIÈRES (RegEx) ---
  const emailValidationRegex = /^[a-zA-Z0-9@._+-]*$/;
  const passwordValidationRegex = /^[\x20-\x7E]*$/;

  // ÉTAPE 1 : Connexion standard
  const onsum = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5005/auth", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        method: "POST"
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.token);
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
      } else {
        setError(data.message || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Demander le code par email
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5005/auth/forgot-password", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        method: "POST"
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3); // Passer à la saisie du code
      } else {
        setError(data.message || "Erreur lors de l'envoi de l'email.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 3 : Vérifier le code et changer le mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5005/auth/reset-password", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          code: resetCode, 
          newPassword 
        }),
        method: "POST"
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Mot de passe modifié avec succès ! Connectez-vous.");
        setStep(1); // Retour au login
        setPassword("");
        setResetCode("");
        setNewPassword("");
      } else {
        setError(data.message || "Code invalide ou expiré.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          {step === 1 ? "Welcome Back" : step === 2 ? "Reset Password" : "New Password"}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {step === 1 ? "Login to manage your appointments" : step === 2 ? "Enter your email to receive a code" : "Enter the 6-digit code and your new password"}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}
        
        {successMessage && step === 1 && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* --- ÉTAPE 1 : LOGIN --- */}
        {step === 1 && (
          <form onSubmit={onsum} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => emailValidationRegex.test(e.target.value) && setemail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => passwordValidationRegex.test(e.target.value) && setpassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex justify-end mt-2">
                <button type="button" onClick={() => { setStep(2); setError(""); setSuccessMessage(""); }} className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* --- ÉTAPE 2 : DEMANDE DE CODE --- */}
        {step === 2 && (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => emailValidationRegex.test(e.target.value) && setemail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button type="submit" disabled={loading || !email} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:underline text-center">
              Back to Login
            </button>
          </form>
        )}

        {/* --- ÉTAPE 3 : VÉRIFICATION ET NOUVEAU MOT DE PASSE --- */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-center">6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                required
                value={resetCode}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) setResetCode(e.target.value);
                }}
                className="w-full text-center text-3xl tracking-[0.5em] border border-gray-300 rounded-xl px-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                value={newPassword}
                onChange={(e) => passwordValidationRegex.test(e.target.value) && setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter new password"
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button type="submit" disabled={loading || resetCode.length !== 6 || newPassword.length < 8} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 ${loading || resetCode.length !== 6 || newPassword.length < 8 ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:underline text-center">
              Back to Login
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-gray-500 mt-6">
            Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;