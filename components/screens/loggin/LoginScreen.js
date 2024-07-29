import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, update, get } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Obtener el nombre de usuario (displayName) después de iniciar sesión
        const user = auth.currentUser;
        if (user) {
          const username = user.displayName;
          const db = getDatabase();
          const userRef = ref(db, `usuarios/${username}`);

          // Obtener los datos actuales del usuario
          get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();

              // Establecer los valores predeterminados si no existen
              const updatedData = {
                alarmActive: false,
                alarmCode: userData.alarmCode || 'Apagar',
                email: user.email,
                nombre: userData.nombre || user.displayName || 'Nombre no disponible',
                uid: user.uid,
                username: username,
                movimientos: userData.movimientos || { count: 0 }
              };

              // Actualizar los datos del usuario en la base de datos
              update(userRef, updatedData)
                .then(() => {
                  navigation.replace('MenuScreen');
                })
                .catch((error) => {
                  console.error('Error al actualizar los datos del usuario:', error);
                  Alert.alert('Error', 'No se pudo actualizar los datos del usuario.');
                });
            } else {
              // Si no existe el usuario en la base de datos, crear la entrada con los datos necesarios
              const newUserData = {
                alarmActive: false,
                alarmCode: 'Apagar',
                email: user.email,
                nombre: user.displayName || 'Nombre no disponible',
                uid: user.uid,
                username: username,
                movimientos: { count: 0 }
              };

              // Crear los datos del usuario en la base de datos
              update(userRef, newUserData)
                .then(() => {
                  navigation.replace('MenuScreen');
                })
                .catch((error) => {
                  console.error('Error al crear los datos del usuario:', error);
                  Alert.alert('Error', 'No se pudo crear los datos del usuario.');
                });
            }
          }).catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
            Alert.alert('Error', 'No se pudo obtener los datos del usuario.');
          });
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error al iniciar sesión', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Iniciar Sesión</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={20} color="#ccc" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={20} color="#ccc" />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#2c2c2c',
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#0EB383',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#0EB383',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
