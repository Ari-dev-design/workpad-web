import { createContext, useState, useEffect, useContext } from "react";
// importamos las funciones de la api
import { loginUser, registerUser, logoutUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // esto se ejecuta al abrir la web para ver si ya estabamos logueados
  useEffect(() => {
    const checkSession = () => {
      try {
        // miramos en la memoria del navegador
        const storedUser = localStorage.getItem("user_workpad");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // si falla borramos todo por si acaso
        localStorage.removeItem("user_workpad");
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // funcion para entrar
  const login = async (email, password) => {
    const result = await loginUser(email, password);

    if (result.success) {
      setUser(result.user);
      // guardamos los datos para que no se cierre la sesion al recargar
      localStorage.setItem("user_workpad", JSON.stringify(result.user));
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  // funcion para registrarse
  const signup = async (email, password) => {
    const result = await registerUser(email, password);

    if (result.success) {
      setUser(result.user);
      localStorage.setItem("user_workpad", JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  // funcion para salir
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user_workpad");
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
