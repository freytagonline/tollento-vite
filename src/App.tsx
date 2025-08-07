import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState<'talent' | 'employer'>('talent');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

          <form className="space-y-4">
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {showLogin ? "Anmelden" : "Registrieren"}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowLogin(!showLogin);
                  setEmail("");
                  setPassword("");
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                {showLogin ? "Noch kein Konto? Registrieren" : "Bereits ein Konto? Anmelden"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
