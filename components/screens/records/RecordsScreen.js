import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAlarm } from '../../AlarmContext';
import AlarmScreen from '../alarm/AlarmScreen';

const RecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const { alarmTriggered, setAlarmTriggered, deactivateAlarm } = useAlarm();

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

            const fetchRecords = async () => {
              const recordsRef = ref(db, `usuarios/${userData.username}/movimientos`);
              try {
                const snapshot = await get(recordsRef);
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  const recordsList = Object.keys(data).filter(key => key !== 'count').map(key => ({ id: key, ...data[key] }));
                  setRecords(recordsList);
                }
              } catch (error) {
                console.error(error);
              }
              setLoading(false);
            };

            fetchRecords();
            const intervalId = setInterval(fetchRecords, 10000);
            return () => clearInterval(intervalId);
          } else {
            throw new Error('El usuario no existe en la base de datos');
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, []);

  const clearRecords = async () => {
    const db = getDatabase();
    const recordsRef = ref(db, `usuarios/${username}/movimientos`);

    try {
      const snapshot = await get(recordsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updates = {};
        Object.keys(data).forEach(key => {
          if (key !== 'count') {
            updates[key] = null;
          }
        });

        await remove(recordsRef);
        await set(ref(db, `usuarios/${username}/movimientos/count`), 0);

        Alert.alert('Registros eliminados');
        setRecords([]);
      } else {
        await set(ref(db, `usuarios/${username}/movimientos/count`), 0);
        Alert.alert('Ruta de movimientos creada con conteo inicial de 0');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al eliminar registros', error.message);
    }
  };

  const confirmClearRecords = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar todos los registros?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: clearRecords,
          style: 'destructive',
        },
      ]
    );
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
    filterByDate(date);
  };

  const filterByDate = async (date) => {
    const db = getDatabase();
    const recordsRef = ref(db, `usuarios/${username}/movimientos`);
    try {
      const snapshot = await get(recordsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const recordsList = Object.keys(data).filter(key => key !== 'count').map(key => ({ id: key, ...data[key] }));
        const filteredRecords = recordsList.filter(record => {
          const recordDate = new Date(record.fechaHora);
          return recordDate.toDateString() === date.toDateString();
        });
        setRecords(filteredRecords);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSortOrder = () => {
    const sortedRecords = [...records].sort((a, b) => isAscending ? new Date(a.fechaHora) - new Date(b.fechaHora) : new Date(b.fechaHora) - new Date(a.fechaHora));
    setRecords(sortedRecords);
    setIsAscending(!isAscending);
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  if (alarmTriggered) {
    return <AlarmScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registros de Movimientos</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonRed} onPress={confirmClearRecords}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Limpiar Registros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonBlue} onPress={() => setDatePickerVisibility(true)}>
            <MaterialCommunityIcons name="calendar" size={24} color="#fff" />
            <Text style={styles.buttonText}>Filtrar por Fecha</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.buttonSort, isAscending ? styles.buttonAscending : styles.buttonDescending]} 
            onPress={toggleSortOrder}
          >
            <MaterialCommunityIcons 
              name={isAscending ? "sort-ascending" : "sort-descending"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.buttonText}>
              {isAscending ? 'Orden Ascendente' : 'Orden Descendente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleConfirm(date)}
        />
      )}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#ccc" />
            <View style={styles.recordTextContainer}>
              <Text style={styles.recordText}>Fecha y Hora: {item.fechaHora}</Text>
            </View>
          </View>
        )}
      />
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
  buttonContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonRed: {
    backgroundColor: '#0EB383',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBlue: {
    backgroundColor: '#0EB383',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSort: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAscending: {
    backgroundColor: '#0EB383',
  },
  buttonDescending: {
    backgroundColor: '#0EB383',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  recordTextContainer: {
    marginLeft: 10,
  },
  recordText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default RecordsScreen;
