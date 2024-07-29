import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfileScreen from './screens/users/UserProfileScreen';
import EditProfileScreen from './screens/users/EditProfileScreen';

const Stack = createStackNavigator();

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default UserStack;
