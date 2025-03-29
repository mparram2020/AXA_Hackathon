import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location'; // Asegúrate de tener expo-location instalado
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LocationSelector } from './claims/LocationSelector';

export function InsuranceLocation({ onComplete, isLoading }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Explicitly define the type

  const handleShareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Error fetching location');
    }
  };

  const handleSubmit = () => {
    if (location) {
      onComplete(location); // Envía la ubicación al componente padre o realiza alguna acción
    } else {
      setErrorMsg('Please share your location before continuing');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LocationSelector 
      value={
        latitude: 0;
        longitude: 0;
        address: 0;
      }
      onChange={
        setLocation()
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 16,
  },
  label: {
    marginBottom: 12,
    fontWeight: '500',
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: '#103184', // AXA blue
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successText: {
    color: '#28A745',
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#FF1721',
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#103184', // AXA blue
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});