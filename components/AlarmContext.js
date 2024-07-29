import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const alarmRef = ref(db, `usuarios/${user.displayName}/alarmActive`);

      // Set alarmActive to false on app start
      set(alarmRef, false);

      // Listen for changes in alarmActive
      onValue(alarmRef, (snapshot) => {
        if (snapshot.exists()) {
          const alarmStatus = snapshot.val();
          setAlarmActive(alarmStatus);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (alarmActive && !isPlaying) {
      playSound();
    }
  }, [alarmActive]);

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm.mp3')
      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir sonido', error);
    }
  }

  async function stopSound() {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error al detener sonido', error);
    }
  }

  const deactivateAlarm = async () => {
    stopSound();
    setAlarmActive(false);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const alarmRef = ref(db, `usuarios/${user.displayName}/alarmActive`);
      await set(alarmRef, false);
    }
  };

  return (
    <AlarmContext.Provider value={{ isPlaying, stopSound, alarmActive, deactivateAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  return useContext(AlarmContext);
};
