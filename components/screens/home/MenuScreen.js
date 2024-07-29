// /components/screens/home/MenuScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MenuScreen = ({ navigation }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigation.replace('Auth');
    }
  }, [user, loading, navigation]);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menú Principal</Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Records')}>
        <MaterialCommunityIcons name="file-document" size={24} color="#fff" />
        <Text style={styles.menuButtonText}>Ver Registros de Movimientos</Text>
      </TouchableOpacity>
      {/* Agrega otros botones de menú según sea necesario */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EB383',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  menuButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
  },
});

export default MenuScreen;
