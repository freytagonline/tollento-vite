export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🚀 Tollento Vite App
        </h1>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Deine App ist erfolgreich deployed!
          </p>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 font-medium">
              ✅ App läuft erfolgreich!
            </p>
          </div>
          
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p>✅ Vite Build funktioniert</p>
            <p>✅ React App läuft</p>
            <p>✅ Tailwind CSS geladen</p>
            <p>✅ Deployment erfolgreich</p>
          </div>
        </div>
      </div>
    </div>
  );
}
