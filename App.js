import React from 'react';
import Navigation from './components/Navigation';
import { AuthProvider } from './components/AuthProvider';
import { AlarmProvider } from './components/AlarmContext';

export default function App() {
  return (
    <AuthProvider>
      <AlarmProvider>
        <Navigation />
      </AlarmProvider>
    </AuthProvider>
  );
}
