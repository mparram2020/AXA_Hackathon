import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { LocationSelector } from '@/components/claims/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors, Fonts } from '@/constants/theme';
import { router } from 'expo-router';

export default function Step4() {
  const { setData, data } = useInsurance();
  const [selectedParking, setSelectedParking] = useState<string | null>(null);

  const handleLocationChange = (location: { latitude?: number; longitude?: number; address?: string }) => {
    setData({ location });
  };

  const handleParkingSelection = (parking: string) => {
    setSelectedParking(parking);
    setData({ location: { ...data.location, parking } });
  };

  const handleProceed = () => {
    if (selectedParking && data.location?.latitude && data.location?.longitude) {
      router.push('/insurance/offer'); // Navigate to the next step
    }
  };

  const isProceedDisabled = !selectedParking || !data.location?.latitude || !data.location?.longitude;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>¿Dónde está estacionado el vehículo?</ThemedText>
      <LocationSelector value={data.location || {}} onChange={handleLocationChange} />

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedParking === 'Garage' && styles.selectedOption,
          ]}
          onPress={() => handleParkingSelection('Garage')}
        >
          <ThemedText style={styles.optionText}>Estacionado en un garaje</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            selectedParking === 'Field' && styles.selectedOption,
          ]}
          onPress={() => handleParkingSelection('Field')}
        >
          <ThemedText style={styles.optionText}>Estacionado en un campo</ThemedText>
        </TouchableOpacity>
      </View>

      <Button
        title="Continuar"
        onPress={handleProceed}
        type="primary"
        style={[styles.proceedButton, isProceedDisabled && styles.disabledButton]}
        disabled={isProceedDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  title: {
    ...Fonts.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(16, 49, 132, 0.1)', // Light blue background for selected option
  },
  optionText: {
    ...Fonts.body,
    fontWeight: '600',
    color: Colors.primary,
  },
  proceedButton: {
    marginTop: 24,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: Colors.border, // Gray background for disabled state
  },
});