import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  
  // Nouveaux states pour gérer l'étape de vérification
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // --- EXPRESSIONS RÉGULIÈRES (RegEx) ---
  const textValidationRegex = /^$|^(?!.*[ \-']{2})[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-']*$/;
  const phoneValidationRegex = /^$|^\+?(?:[0-9]+\s?)*$/;
  const emailValidationRegex = /^[a-zA-Z0-9@._+-]*$/;
  const passwordValidationRegex = /^[\x20-\x7E]*$/;

  // ÉTAPE 1 : Soumission du formulaire complet
  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanPhone = phone.replace(/\s/g, "");

    try {
      // ATTENTION: Mise à jour de l'URL pour correspondre à la nouvelle route backend
      const response = await fetch("http://127.0.0.1:5005/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          phone: cleanPhone,
          date,
          location: location.trim(),
          email: email.trim(),
          password 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep(2); // On passe à l'étape du code au lieu de naviguer
      } else {
        setError(data.message || "L'inscription a échoué.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Soumission du code de vérification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5005/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode 
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/"); // Inscription et vérification terminées avec succès !
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          {step === 1 ? "Create an Account" : "Verify Your Email"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {step === 1 ? "Register to manage your appointments" : `We sent a 6-digit code to ${email}`}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* --- FORMULAIRE D'INSCRIPTION (ÉTAPE 1) --- */}
        {step === 1 && (
          <form onSubmit={handlesubmit} className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input type="text" placeholder="First name" required value={firstname}
                onChange={(e) => textValidationRegex.test(e.target.value) && setFirstname(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input type="text" placeholder="Last name" required value={lastname}
                onChange={(e) => textValidationRegex.test(e.target.value) && setLastname(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => {
                  if (emailValidationRegex.test(e.target.value)) setEmail(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                minLength={8}
                value={password}
                onChange={(e) => {
                  if (passwordValidationRegex.test(e.target.value)) setPassword(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input type="date" required max={today} value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input type="tel" placeholder="+213 555 55 55 55" required value={phone}
                onChange={(e) => phoneValidationRegex.test(e.target.value) && setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Location</label>
              <input type="text" placeholder="City, Country" required value={location}
                onChange={(e) => textValidationRegex.test(e.target.value) && setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button type="submit" disabled={loading} className={`col-span-2 font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* --- FORMULAIRE DE VÉRIFICATION (ÉTAPE 2) --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-center">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                required
                value={verificationCode}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) setVerificationCode(e.target.value);
                }}
                className="w-full text-center text-3xl tracking-[0.5em] border border-gray-300 rounded-xl px-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button type="submit" disabled={loading || verificationCode.length !== 6} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 ${loading || verificationCode.length !== 6 ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:underline text-center">
              Wrong email? Go back
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;