// /components/Navigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "./AuthProvider";
import { useAlarm } from "./AlarmContext";

// screens
import UserStack from "./UserStack";
import LoginScreen from "./screens/loggin/LoginScreen";
import RegisterScreen from "./screens/loggin/RegisterScreen";
import MenuScreen from "./screens/home/MenuScreen";
import SettingsScreen from "./screens/settings/SettingsScreen";
import ClaveScreen from "./screens/clave/ClaveScreen"; // Renombrado desde PuertaScreen
import RecordsScreen from "./screens/records/RecordsScreen";
import RequireAuth from "./screens/auth/RequireAuth";
import AlarmScreen from "./screens/alarm/AlarmScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyStack1() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1c1c1c' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="MenuScreen" component={RequireAuth(MenuScreen)} />
      <Stack.Screen name="Records" component={RequireAuth(RecordsScreen)} />
      <Stack.Screen name="AlarmScreen" component={RequireAuth(AlarmScreen)} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1c1c1c' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="AuthPlaceholder"
      screenOptions={{
        tabBarActiveTintColor: "#0EB383",
        tabBarStyle: { backgroundColor: '#1c1c1c' },
      }}
    >
      <Tab.Screen
        options={{
          tabBarBadge: 5,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
        name="Menu"
        component={MyStack1}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
        name="Settings"
        component={RequireAuth(SettingsScreen)}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lock" size={size} color={color}/>
          ),
        }}
        name="Clave"
        component={RequireAuth(ClaveScreen)}
      />
      {user ? (
        <>
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              ),
            }}
            name="Account"
            component={UserStack}
          />
        </>
      ) : (
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
          name="Auth"
          component={AuthStack}
        />
      )}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { alarmActive } = useAlarm();
  console.log("Alarm active:", alarmActive);

  return (
    <NavigationContainer theme={DarkTheme}>
      <MyTabs />
      {alarmActive && <AlarmScreen />}
    </NavigationContainer>
  );
}
