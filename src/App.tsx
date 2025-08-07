import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { checkEmailExists, getAuthErrorMessage, isValidEmail, validatePassword } from "./lib/authHelpers";
import Header from "./components/Header";

export default function App() {
  const [tab, setTab] = useState<'talent' | 'employer'>('talent');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(60);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [emailMessage, setEmailMessage] = useState<string>("");

  // Countdown für Reset-Button
  useEffect(() => {
    if (showLogin && showReset && resetSuccess && resetCountdown > 0) {
      const timer = setTimeout(() => setResetCountdown(resetCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (!resetSuccess) {
      setResetCountdown(60);
    }
  }, [showLogin, showReset, resetSuccess, resetCountdown]);

  // E-Mail-Prüfung mit Debouncing
  useEffect(() => {
    if (!email || showLogin) {
      setEmailStatus('idle');
      setEmailMessage("");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailStatus('invalid');
      setEmailMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    setEmailStatus('checking');
    setEmailMessage("Prüfe E-Mail-Adresse...");

    const timeoutId = setTimeout(async () => {
      try {
        console.log("Prüfe E-Mail:", email);
        const emailExists = await checkEmailExists(email);
        console.log("E-Mail existiert:", emailExists);
        
        if (emailExists) {
          setEmailStatus('taken');
          setEmailMessage("Diese E-Mail-Adresse ist bereits registriert.");
        } else {
          setEmailStatus('available');
          setEmailMessage("E-Mail-Adresse ist verfügbar.");
        }
      } catch (error) {
        console.error("Fehler bei E-Mail-Prüfung:", error);
        setEmailStatus('idle');
        setEmailMessage("");
      }
    }, 500); // 500ms Debounce

    return () => clearTimeout(timeoutId);
  }, [email, showLogin]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validierung
    if (emailStatus === 'invalid') {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    
    if (emailStatus === 'taken') {
      setError("Diese E-Mail-Adresse ist bereits registriert. Falls Sie Ihr Passwort vergessen haben, können Sie es über 'Login' → 'Passwort vergessen' zurücksetzen.");
      return;
    }
    
    if (emailStatus === 'checking') {
      setError("Bitte warten Sie, während wir Ihre E-Mail-Adresse prüfen.");
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message!);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: tab,
          },
        },
      });

      if (error) {
        setError(getAuthErrorMessage(error.message));
      } else {
        setSuccess(true);
        setEmail("");
        setPassword("");
        setEmailStatus('idle');
        setEmailMessage("");
      }
    } catch (error) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(getAuthErrorMessage(error.message));
      } else {
        setSuccess(true);
        // Hier könntest du zur Dashboard-Seite weiterleiten
        console.log("Login erfolgreich");
      }
    } catch (error) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(getAuthErrorMessage(error.message));
      } else {
        setResetSuccess(true);
        setEmail("");
      }
    } catch (error) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Willkommen bei Tollento
          </h1>
          
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTab('talent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tab === 'talent'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Talent
            </button>
            <button
              onClick={() => setTab('employer')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tab === 'employer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Arbeitgeber
            </button>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">
                {showLogin 
                  ? "Login erfolgreich! Sie werden weitergeleitet..."
                  : "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails."
                }
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {showReset ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ihre@email.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sende..." : "Passwort zurücksetzen"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setEmail("");
                  setError(null);
                }}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Zurück zum Login
              </button>
            </form>
          ) : (
            <form onSubmit={showLogin ? handleLogin : handleRegister} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ihre@email.com"
                  required
                />
                {emailMessage && (
                  <p className={`text-sm mt-1 ${
                    emailStatus === 'available' ? 'text-green-600' :
                    emailStatus === 'taken' ? 'text-red-600' :
                    emailStatus === 'invalid' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {emailMessage}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || (emailStatus === 'checking' && !showLogin)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verarbeite..." : (showLogin ? "Anmelden" : "Registrieren")}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(!showLogin);
                    setEmail("");
                    setPassword("");
                    setError(null);
                    setSuccess(false);
                    setEmailStatus('idle');
                    setEmailMessage("");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showLogin ? "Noch kein Konto? Registrieren" : "Bereits ein Konto? Anmelden"}
                </button>
              </div>
              
              {showLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReset(true);
                      setError(null);
                      setSuccess(false);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
