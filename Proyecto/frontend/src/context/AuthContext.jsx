import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [usuario,  setUsuario]  = useState(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem('jps_token');
    const u = localStorage.getItem('jps_usuario');
    if (t && u) setUsuario(JSON.parse(u));
    setCargando(false);
  }, []);
  const iniciarSesion = (token, user) => {
    localStorage.setItem('jps_token',   token);
    localStorage.setItem('jps_usuario', JSON.stringify(user));
    setUsuario(user);
  };
  const cerrarSesion = () => {
    localStorage.removeItem('jps_token');
    localStorage.removeItem('jps_usuario');
    setUsuario(null);
  };
  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
