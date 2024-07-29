import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../FirebaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Verificar el usuario en la base de datos
          const userRef = ref(getDatabase(), `usuarios/${firebaseUser.displayName}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUser({ ...firebaseUser, ...userData });

            // Setear alarmActive a false al iniciar sesión sin sobreescribir otros datos
            const updates = {};
            updates['/usuarios/' + firebaseUser.displayName + '/alarmActive'] = false;
            await update(ref(getDatabase()), updates);
          } else {
            // Si el usuario no existe en la base de datos, cerrar sesión
            await signOut(auth);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar el estado de autenticación:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
