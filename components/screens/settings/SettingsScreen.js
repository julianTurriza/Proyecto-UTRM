// /components/screens/settings/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const SettingsScreen = () => {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `usuarios/${user.displayName}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username);
            setIsAlarmEnabled(userData.isAlarmEnabled || false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUserData();
  }, []);

  const toggleAlarm = async () => {
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${username}`);
    setIsAlarmEnabled((prevState) => !prevState);
    await set(userRef, { isAlarmEnabled: !isAlarmEnabled });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configuraciones</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Habilitar Alarma</Text>
        <Switch
          value={isAlarmEnabled}
          onValueChange={toggleAlarm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SettingsScreen;
