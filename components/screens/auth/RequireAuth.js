// /components/screens/auth/RequireAuth.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthProvider';

const RequireAuth = (Component) => {
  return (props) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      );
    }

    if (!user) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>No autorizado. Por favor, inicia sesión.</Text>
        </View>
      );
    }

    return <Component {...props} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RequireAuth;
