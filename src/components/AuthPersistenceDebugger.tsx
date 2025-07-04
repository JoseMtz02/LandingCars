import { useAuthStore } from "../store/authStore";

export const AuthPersistenceDebugger = () => {
  const { user, token, isAuthenticated, lastAuthCheck } = useAuthStore();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const getStoredData = () => {
    try {
      const stored = localStorage.getItem("titan-auth-storage");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storedData = getStoredData();

  const clearStorage = () => {
    localStorage.removeItem("titan-auth-storage");
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-md">
      <h3 className="font-bold mb-2">Auth Persistence Debug</h3>

      <div className="space-y-2">
        <div>
          <strong>Estado Actual:</strong>
          <div className="ml-2">
            <div>Autenticado: {isAuthenticated ? "✅" : "❌"}</div>
            <div>Usuario: {user?.username || "N/A"}</div>
            <div>Token: {token ? "✅" : "❌"}</div>
            <div>
              Última verificación:{" "}
              {lastAuthCheck
                ? new Date(lastAuthCheck).toLocaleTimeString()
                : "N/A"}
            </div>
          </div>
        </div>

        <div>
          <strong>LocalStorage:</strong>
          <div className="ml-2">
            <div>Existe: {storedData ? "✅" : "❌"}</div>
            {storedData && (
              <>
                <div>
                  Autenticado: {storedData.state?.isAuthenticated ? "✅" : "❌"}
                </div>
                <div>Usuario: {storedData.state?.user?.name || "N/A"}</div>
                <div>Token: {storedData.state?.token ? "✅" : "❌"}</div>
              </>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <button
            onClick={clearStorage}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Limpiar Cache y Recargar
          </button>
        </div>
      </div>
    </div>
  );
};
