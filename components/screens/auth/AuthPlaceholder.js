import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const AuthPlaceholder = () => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigation.navigate('Auth'); // Redirige a la pantalla de login si no está autenticado
      } else {
        navigation.navigate('Menu'); // Redirige a la pantalla de menú si está autenticado
      }
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthPlaceholder;
