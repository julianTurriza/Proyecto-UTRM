import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert } from 'react-native';
import { useAlarm } from '../../AlarmContext';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';

const AlarmScreen = () => {
  const { stopSound, deactivateAlarm } = useAlarm();
  const [inputCode, setInputCode] = useState('');
  const [alarmCode, setAlarmCode] = useState('apagar'); // Default alarm code
  const auth = getAuth();
  const user = auth.currentUser;

  React.useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${user.displayName}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setAlarmCode(userData.alarmCode || 'apagar');
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [user]);

  const handleDeactivate = () => {
    if (inputCode === alarmCode) {
      deactivateAlarm();
      stopSound();
      Alert.alert('Alarma desactivada');
    } else {
      Alert.alert('Código incorrecto');
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Alarma Activada</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el código de apagado"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={inputCode}
            onChangeText={setInputCode}
          />
          <Button title="Desactivar Alarma" onPress={handleDeactivate} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    color: '#fff',
  },
});

export default AlarmScreen;
