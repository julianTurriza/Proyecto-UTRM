import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const EditProfileScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log('user.displayName:', user.displayName);  // Agrega este console.log
      const userRef = ref(db, `usuarios/${user.displayName}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setNombre(userData.nombre || '');

          console.log('Datos de usuario en EditProfileScreen:', userData);  // Mostrar datos del usuario
          console.log('Username en EditProfileScreen:', userData.username);  // Agrega este console.log
        }
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const userRef = ref(db, `usuarios/${user.displayName}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const currentData = snapshot.val();

          // Actualizar solo el campo nombre
          const updatedData = {
            ...currentData,
            nombre: nombre || currentData.nombre,
          };

          await update(userRef, updatedData);

          Alert.alert('Información actualizada');
          navigation.navigate('User');
        } else {
          throw new Error('El usuario no existe en la base de datos');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error al actualizar información', error.message);
      }
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actualizar Información</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={handleSave} color="#0EB383" />
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
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#ccc',
  },
  input: {
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
  },
});

export default EditProfileScreen;
