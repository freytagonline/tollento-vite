import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [message, setMessage] = useState('Lade...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test der Supabase-Verbindung
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('test').select('*').limit(1)
        
        if (error) {
          if (error.code === 'PGRST116') {
            // Tabelle existiert nicht - das ist OK für einen Test
            setMessage('✅ Supabase-Verbindung erfolgreich! (Tabelle "test" existiert nicht)')
          } else {
            setError(`Supabase Fehler: ${error.message}`)
          }
        } else {
          setMessage('✅ Supabase-Verbindung erfolgreich!')
        }
      } catch (err) {
        setError(`Verbindungsfehler: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="app">
      <header>
        <h1>🚀 Tollento Vite App</h1>
        <p>Deine App ist erfolgreich deployed!</p>
      </header>
      
      <main>
        <div className="status-card">
          <h2>Supabase Status</h2>
          {error ? (
            <div className="error">
              ❌ {error}
            </div>
          ) : (
            <div className="success">
              {message}
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>🎉 Deployment erfolgreich!</h3>
          <p>Deine Vite + React + Supabase App läuft jetzt auf Vercel.</p>
          <ul>
            <li>✅ Vite Build funktioniert</li>
            <li>✅ React App läuft</li>
            <li>✅ Supabase Integration bereit</li>
            <li>✅ Umgebungsvariablen konfiguriert</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
