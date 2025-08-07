"use client";
import { useState } from "react";

interface HeaderProps {
  onLogout?: () => void;
  logoutDisabled?: boolean;
  user?: { email: string; role: string } | null;
  loading?: boolean;
}

export default function Header({ onLogout, logoutDisabled, loading }: HeaderProps) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  return (
    <header className="flex items-center h-20 px-8 bg-white shadow-sm relative">
      <a href="/dashboard" className="w-32 h-10 bg-gray-300 rounded flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-gray-400 transition-colors">
        LOGO
      </a>
      {/* Avatar-Menü */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex items-center gap-4">
        {/* Avatar-Icon mit Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Account-Menü öffnen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          {/* Dropdown-Menü */}
          {showAvatarMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowAvatarMenu(false)}
              >
                Mein Profil
              </a>
              <a
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowAvatarMenu(false)}
              >
                Mein Konto
              </a>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={logoutDisabled || loading}
              >
                Abmelden
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 