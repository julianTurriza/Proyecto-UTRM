import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getDatabase, ref, update, get } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ClaveScreen = ({ navigation }) => {
  const [alarmCode, setAlarmCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${user.displayName}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setAlarmCode(userData.alarmCode || 'apagar');
        }
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      const credential = EmailAuthProvider.credential(user.email, password);
      reauthenticateWithCredential(user, credential).then(() => {
        const db = getDatabase();
        const userRef = ref(db, `usuarios/${user.displayName}`);
        update(userRef, { alarmCode }).then(() => {
          Alert.alert('Código de apagado actualizado');
        }).catch((error) => {
          console.error(error);
          Alert.alert('Error al actualizar el código de apagado', error.message);
        });
      }).catch((error) => {
        console.error(error);
        Alert.alert('Error al autenticar', error.message);
      });
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configuración de Clave de Apagado</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={24} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nueva Clave de Apagado"
          placeholderTextColor="#aaa"
          value={alarmCode}
          onChangeText={setAlarmCode}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="key-outline" size={24} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña Actual"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <MaterialCommunityIcons name="content-save-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Guardar Clave de Apagado</Text>
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EB383',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
  },
});

export default ClaveScreen;
