import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LocationSelector } from './claims/LocationSelector';

export function InsuranceLocation({ onComplete }) {
  const [location, setLocation] = useState({
    latitude: undefined,
    longitude: undefined,
    address: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    if (location.latitude && location.longitude) {
      onComplete(location); // Pass the location to the parent component
    } else {
      setErrorMsg('Please provide a location before continuing.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Provide the location of the incident:</ThemedText>
      
      {/* Use the LocationSelector component */}
      <LocationSelector 
        value={location}
        onChange={(newLocation) => {
          setLocation(newLocation);
          setErrorMsg(null); // Clear any previous error messages
        }}
      />

      {errorMsg && <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <ThemedText style={styles.submitButtonText}>Submit Location</ThemedText>
      </TouchableOpacity>
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