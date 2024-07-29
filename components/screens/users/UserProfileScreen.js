// /components/screens/users/UserProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UserProfileScreen = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${user.displayName}`); // Cambiar para usar el displayName (username)
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setNombre(userData.nombre || user.displayName || 'Nombre no disponible');
          setUsername(userData.username || 'Username no disponible')
        } else {
          setNombre(user.displayName || 'Nombre no disponible');
        }
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.name}>ID: {nombre}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('EditProfile')}>
            <MaterialCommunityIcons name="account-edit" size={24} color="#fff" />
            <Text style={styles.iconButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            auth.signOut().then(() => {
              Alert.alert('Cierre de sesión exitoso');
              navigation.navigate('Login');
            }).catch(error => {
              console.error(error);
              Alert.alert('Error al cerrar sesión', error.message);
            });
          }}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            <Text style={styles.iconButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  profileCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EB383',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  iconButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
  },
});

export default UserProfileScreen;
